import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/bookings.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from 'src/redis/redis.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventModule } from 'src/event/event.module';
import { Seat } from 'src/seats/entities/seats.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Seat, Event]),
    RedisModule,
    EventModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
          socketOptions: {
          heartbeatIntervalInSeconds: 60,  
          reconnectTimeInSeconds: 5,       
        },
        },
      },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, RedisService],
})
export class BookingsModule {}
