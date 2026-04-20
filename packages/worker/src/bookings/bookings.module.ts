import { Module } from '@nestjs/common';
import { BookingConsumer } from './bookings.consumer';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [MailModule, RedisModule],
  controllers: [BookingConsumer],
})
export class BookingsModule {}
