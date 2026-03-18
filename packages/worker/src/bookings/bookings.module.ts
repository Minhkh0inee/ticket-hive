import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { BookingConsumer } from './bookings.consumer';

@Module({
  imports: [MailModule],
  controllers: [BookingConsumer]
})
export class BookingsModule {}
