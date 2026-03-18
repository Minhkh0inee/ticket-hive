import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking, BookingStatus } from './entities/bookings.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { EventService } from 'src/event/event.service';
import { Seat, SeatStatus } from 'src/seats/entities/seats.entity';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private readonly redisService: RedisService,
    private readonly eventService: EventService,
    private dataSource: DataSource,
  ) {}

  async createBooking(dto: CreateBookingDto, userId: string) {
    await this.validateSeatLocks(dto.eventId, dto.seatIds, userId)

    const event = await this.eventService.findEventById(dto.eventId);
    if (!event) throw new NotFoundException('Event not found');
    const totalPrice = Number(event.basePrice) * dto.seatIds.length;
  
  
        const booking = await this.dataSource.transaction(async (manager) => {
            try {
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
        
            await manager.update(Seat, { id: In(dto.seatIds) }, { status: SeatStatus.BOOKED });
            await manager.decrement(Event, { id: dto.eventId }, 'availableSeats', dto.seatIds.length);
        
            await Promise.all(
              dto.seatIds.map((seatId) =>
                this.redisService.seatUnlock(dto.eventId, seatId, userId)
              )
            );
        
            return saved;
        } catch (error) {
            console.error('Transaction error:', error); 
            throw error;
        }
          });
    
   
  
    this.publishBookingConfirmed(booking, dto, userId, totalPrice);
  
    return booking;
  }

  private async validateSeatLocks(eventId: string, seatIds: string[], userId: string) {
    const lockValues = await this.redisService.getManySeatLocks(eventId, seatIds);

    seatIds.forEach((seatId, index) => {
      const lockedBy = lockValues[index];
      if (!lockedBy) throw new BadRequestException(`Seat ${seatId} is not locked`);
      if (lockedBy !== userId) throw new ForbiddenException(`You do not own lock for seat ${seatId}`);
    });
  }

  private publishBookingConfirmed(
    booking: Booking,
    dto: CreateBookingDto,
    userId: string,
    totalPrice: number,
  ) {
    this.client.emit('booking.confirmed', {
      bookingId: booking.id,
      userId,
      eventId: dto.eventId,
      seatIds: dto.seatIds,
      attendeeEmail: dto.attendeeEmail,
      attendeeName: dto.attendeeName,
      totalPrice,
    }).subscribe();
  }
}
