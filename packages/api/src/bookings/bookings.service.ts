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
import { Event, EventStatus } from 'src/event/entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsService } from 'src/payments/payments.service';
import { Payment, PaymentStatus } from 'src/payments/payment.entity';
import { RedisKeys } from 'src/common/constant/redis-key.constant';
import { generateOrderCode } from 'src/utils/order-code';
import { ConfigService } from '@nestjs/config';
import { SeatsService } from 'src/seats/seats.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private readonly redisService: RedisService,
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
    private dataSource: DataSource,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly paymentsService: PaymentsService,
    private readonly seatsService: SeatsService,
  ) {}

  async createBooking(dto: CreateBookingDto, userId: string) {
    await this.validateSeatLocks(dto.eventId, dto.seatIds, userId);

    const event = await this.eventService.findEventById(dto.eventId);
    if (!event) throw new NotFoundException('Event not found');

    const totalPrice = Number(event.basePrice) * dto.seatIds.length;
    const booking = await this.createBookingTransaction(
      dto,
      userId,
      totalPrice,
    );
    this.seatsService.emitSeatUpdate(
      dto.eventId,
      dto.seatIds,
      SeatStatus.BOOKED,
    );

    await this.unlockSeats(dto.eventId, dto.seatIds, userId);

    try {
      const paymentUrl = await this.createPaymentWithRetry(
        dto,
        booking,
        totalPrice,
      );
      await this.invalidateEventCache(dto.eventId);
      return { booking, paymentUrl };
    } catch (error) {
      await this.compensateFailedPayment(dto, booking.id);
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(
        `Failed to create payment link: ${message}`,
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

  private async createBookingTransaction(
    dto: CreateBookingDto,
    userId: string,
    totalPrice: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const seats = await manager.find(Seat, {
        where: { id: In(dto.seatIds), event: { id: dto.eventId } },
        lock: { mode: 'pessimistic_write' },
      });

      this.validateSeats(seats, dto.seatIds);

      const booking = manager.create(Booking, {
        seatIds: dto.seatIds,
        attendeeName: dto.attendeeName,
        attendeeEmail: dto.attendeeEmail,
        attendeePhone: dto.attendeePhone,
        totalPrice,
        status: BookingStatus.PENDING,
        user: { id: userId },
        event: { id: dto.eventId },
      });
      const saved = await manager.save(booking);

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

      const remaining = await manager.findOne(Event, {
        where: { id: dto.eventId },
        select: ['id', 'availableSeats'],
      });
      if (remaining?.availableSeats === 0) {
        await manager.update(
          Event,
          { id: dto.eventId },
          { status: EventStatus.SOLD_OUT },
        );
      }

      return saved;
    });
  }

  private async createPaymentWithRetry(
    dto: CreateBookingDto,
    booking: Booking,
    totalPrice: number,
  ) {
    const MAX_RETRIES = 3;
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const orderCode = generateOrderCode();

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
        return paymentResult.data?.checkoutUrl;
      } catch (error) {
        const isUniqueViolation =
          (error as { code?: string })?.code === '23505';
        if (isUniqueViolation && attempt < MAX_RETRIES - 1) {
          this.logger.warn(
            `orderCode collision, retrying... attempt ${attempt + 1}`,
          );
          continue;
        }
        throw error;
      }
    }
  }

  private async compensateFailedPayment(
    dto: CreateBookingDto,
    bookingId: string,
  ) {
    this.logger.error(
      `Payment failed for booking ${bookingId}, compensating...`,
    );

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Booking, bookingId, {
        status: BookingStatus.CANCELLED,
      });
      await manager.update(
        Seat,
        { id: In(dto.seatIds) },
        { status: SeatStatus.AVAILABLE },
      );
      await manager.increment(
        Event,
        { id: dto.eventId },
        'availableSeats',
        dto.seatIds.length,
      );
    });
    this.seatsService.emitSeatUpdate(
      dto.eventId,
      dto.seatIds,
      SeatStatus.AVAILABLE,
    );
  }

  private async unlockSeats(
    eventId: string,
    seatIds: string[],
    userId: string,
  ) {
    await Promise.all(
      seatIds.map((seatId) =>
        this.redisService.seatUnlock(eventId, seatId, userId),
      ),
    );
  }

  private async invalidateEventCache(eventId: string) {
    await Promise.all([
      this.redisService.del(RedisKeys.event.item(eventId)),
      this.redisService.del(RedisKeys.event.seats(eventId)),
      this.redisService.clearByPattern(RedisKeys.event.patterns.allList),
      this.redisService.clearByPattern(RedisKeys.event.patterns.allTag),
    ]);
  }

  private validateSeats(seats: Seat[], requestedSeatIds: string[]) {
    if (seats.length !== requestedSeatIds.length) {
      throw new BadRequestException('One or more seats were not found');
    }
    if (!seats.every((seat) => seat.status === SeatStatus.AVAILABLE)) {
      throw new BadRequestException(
        'One or more seats are no longer available',
      );
    }
  }
}
