import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/bookings.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from 'src/redis/redis.service';
import { EventModule } from 'src/event/event.module';
import { Seat } from 'src/seats/entities/seats.entity';
import { Event } from 'src/event/entities/event.entity';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Seat, Event]),
    RedisModule,
    EventModule,
    PaymentsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, RedisService],
})
export class BookingsModule {}
