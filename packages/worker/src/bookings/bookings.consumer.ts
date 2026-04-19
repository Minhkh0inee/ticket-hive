import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { MailService } from '../mail/mail.service';
import type BookingConfirmedPayload from '../../src/interface/bookingConfirmPayload.interface';

@Controller()
export class BookingConsumer {
  private readonly logger = new Logger(BookingConsumer.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern('booking.confirmed')
  async handleBookingConfirmed(
    @Payload() data: BookingConfirmedPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
  
    try {
      await this.mailService.sendBookingConfirmation(data);
      channel.ack(message); 
      this.logger.log(`✅ Booking confirmed email sent: ${data.bookingId}`);
    } catch (error) {
      this.logger.error(`❌ Failed`, error);
      channel.nack(message, false, true); 
    }
  }
}