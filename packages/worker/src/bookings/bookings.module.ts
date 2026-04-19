import { Module } from '@nestjs/common';
import { BookingConsumer } from './bookings.consumer';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [MailModule],
  controllers: [BookingConsumer]
})
export class BookingsModule {}
