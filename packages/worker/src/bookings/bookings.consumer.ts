import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import type BookingConfirmedPayload from '../../src/interface/bookingConfirmPayload.interface';
import { Channel, Message } from 'amqplib';
const MAX_RETRIES = 3;
// 7 days — longer than any realistic RabbitMQ redelivery window
const EMAIL_IDEMPOTENCY_TTL = 60 * 60 * 24 * 7;
const DLQ = 'booking.confirmed.dlq';

@Controller()
export class BookingConsumer {
  private readonly logger = new Logger(BookingConsumer.name);
  private readonly retryCounts = new Map<string, number>();

  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  @EventPattern('booking.confirmed')
  async handleBookingConfirmed(
    @Payload() data: BookingConfirmedPayload,
    @Ctx() context: RmqContext,
  ) {
    // 2. Cast the channel and message to their proper types
    const channel = context.getChannelRef() as Channel;
    const message = context.getMessage() as Message;
    const idempotencyKey = `email:sent:${data.bookingId}`;

    try {
      // 3. Type the Redis result to avoid 'any' assignment
      const alreadySent = await this.redisService.get(idempotencyKey);

      if (alreadySent) {
        this.logger.warn(
          `⚠️ Duplicate message skipped — bookingId: ${data.bookingId}`,
        );
        channel.ack(message);
        return;
      }

      await this.mailService.sendBookingConfirmation(data);
      await this.redisService.set(idempotencyKey, '1', EMAIL_IDEMPOTENCY_TTL);
      this.retryCounts.delete(data.bookingId);
      channel.ack(message);
      this.logger.log(`✅ Booking confirmed email sent: ${data.bookingId}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to process booking ${data.bookingId}`,
        error,
      );

      const attempts = (this.retryCounts.get(data.bookingId) ?? 0) + 1;
      this.retryCounts.set(data.bookingId, attempts);

      if (attempts >= MAX_RETRIES) {
        this.logger.warn(
          `🪦 Routing to DLQ after ${attempts} attempts — bookingId: ${data.bookingId}`,
        );

        // 4. Now that 'channel' and 'message' are typed, these calls are safe!
        channel.sendToQueue(DLQ, message.content, {
          persistent: true,
          headers: {
            ...message.properties.headers,
            'x-original-routing-key': 'booking.confirmed',
          },
        });

        this.retryCounts.delete(data.bookingId);
        channel.ack(message);
      } else {
        this.logger.warn(
          `🔁 Requeueing (attempt ${attempts}/${MAX_RETRIES}) — bookingId: ${data.bookingId}`,
        );
        channel.nack(message, false, true);
      }
    }
  }
}
