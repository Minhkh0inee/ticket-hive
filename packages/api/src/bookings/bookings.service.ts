 import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Booking, BookingStatus } from './entities/bookings.entity';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { EventService } from 'src/event/event.service';
import { Seat, SeatStatus } from 'src/seats/entities/seats.entity';
import { Event } from 'src/event/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsService } from 'src/payments/payments.service';
import { Payment, PaymentStatus } from 'src/payments/payment.entity';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private readonly redisService: RedisService,
    private readonly eventService: EventService,
    private dataSource: DataSource,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly paymentsService: PaymentsService,
  ) {}

  async createBooking(dto: CreateBookingDto, userId: string) {
    await this.validateSeatLocks(dto.eventId, dto.seatIds, userId);

    const event = await this.eventService.findEventById(dto.eventId);
    if (!event) throw new NotFoundException('Event not found');
    const totalPrice = Number(event.basePrice) * dto.seatIds.length;

    const booking = await this.dataSource.transaction(async (manager) => {
      try {
        const seats = await manager.find(Seat, {
          where: {
            id: In(dto.seatIds),
            event: { id: dto.eventId },
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (seats.length !== dto.seatIds.length) {
          throw new BadRequestException('One or more seats were not found');
        }

        const isAllAvailable = seats.every(
          (seat) => seat.status === SeatStatus.AVAILABLE,
        );
        if (!isAllAvailable) {
          throw new BadRequestException(
            'One or more seats are no longer available',
          );
        }

        const newBooking = manager.create(Booking, {
          seatIds: dto.seatIds,
          attendeeName: dto.attendeeName,
          attendeeEmail: dto.attendeeEmail,
          attendeePhone: dto.attendeePhone,
          totalPrice,
          status: BookingStatus.PENDING,
          user: { id: userId },
          event: { id: dto.eventId },
        });
        const saved = await manager.save(newBooking);

        await manager.update(
          Seat,
          { id: In(dto.seatIds) },
          { status: SeatStatus.BOOKED },
        );

        await manager.decrement(
          Event,
          { id: dto.eventId },
          'availableSeats',
          dto.seatIds.length,
        );

        await Promise.all(
          dto.seatIds.map((seatId) =>
            this.redisService.seatUnlock(dto.eventId, seatId, userId),
          ),
        );

        return saved;
      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }
    });

    // Create PayOS payment link and persist Payment record
    try {
      // 10-digit orderCode within PayOS limit (1–9999999999999)
      const orderCode = Number(Date.now().toString().slice(3, 13));
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

      const paymentResult = await this.paymentsService.createPaymentLink({
        orderCode,
        amount: Math.round(totalPrice),
        description: `TH-${booking.id.slice(0, 8).toUpperCase()}`,
        buyerName: dto.attendeeName,
        buyerEmail: dto.attendeeEmail,
        buyerPhone: dto.attendeePhone,
        items: [],
        returnUrl: `${frontendUrl}/payment/success?bookingId=${booking.id}`,
        cancelUrl: `${frontendUrl}/payment/cancel?bookingId=${booking.id}`,
      });

      const payment = this.dataSource.manager.create(Payment, {
        orderCode,
        amount: totalPrice,
        status: PaymentStatus.PENDING,
        paymentLinkId: paymentResult.data?.paymentLinkId ?? null,
        checkoutUrl: paymentResult.data?.checkoutUrl ?? null,
        booking: { id: booking.id },
      });
      await this.dataSource.manager.save(Payment, payment);

      this.logger.log(`Payment link created for booking ${booking.id}`);
      return { booking, paymentUrl: paymentResult.data?.checkoutUrl };
    } catch (error) {
      // Compensate: mark booking cancelled, restore seats and event count
      this.logger.error(
        `Payment link creation failed for booking ${booking.id}: ${error.message}`,
      );
      await this.bookingRepo.update(booking.id, {
        status: BookingStatus.CANCELLED,
      });
      await this.dataSource.manager.update(
        Seat,
        { id: In(dto.seatIds) },
        { status: SeatStatus.AVAILABLE },
      );
      await this.dataSource.manager.increment(
        Event,
        { id: dto.eventId },
        'availableSeats',
        dto.seatIds.length,
      );
      throw new BadRequestException(
        `Failed to create payment link: ${error.message}`,
      );
    }
  }

  async getMyBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: {
        user: { id: userId },
        deletedAt: IsNull(),
      },
      relations: ['event', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBookingById(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: {
        id: bookingId,
        user: { id: userId },
      },
      relations: ['event', 'user'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }

    return booking;
  }

  private async validateSeatLocks(
    eventId: string,
    seatIds: string[],
    userId: string,
  ) {
    const lockValues = await this.redisService.getManySeatLocks(
      eventId,
      seatIds,
    );

    seatIds.forEach((seatId, index) => {
      const lockedBy = lockValues[index];
      if (!lockedBy)
        throw new BadRequestException(`Seat ${seatId} is not locked`);
      if (lockedBy !== userId)
        throw new ForbiddenException(`You do not own lock for seat ${seatId}`);
    });
  }

  private publishBookingConfirmed(
    booking: Booking,
    dto: CreateBookingDto,
    userId: string,
    totalPrice: number,
  ) {
    this.client
      .emit('booking.confirmed', {
        bookingId: booking.id,
        userId,
        eventId: dto.eventId,
        seatIds: dto.seatIds,
        attendeeEmail: dto.attendeeEmail,
        attendeeName: dto.attendeeName,
        totalPrice,
      })
      .subscribe({
        error: (err) =>
          this.logger.error('Failed to publish booking.confirmed event', err),
      });
  }
}
