import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PayOS } from '@payos/node';
import { WebhookPayosBody, WebhookPayosDto } from './dto/webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { In, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/entities/bookings.entity';
import { Seat, SeatStatus } from '../seats/entities/seats.entity';
import { Event } from '../event/entities/event.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject('PAYOS_CLIENT') private readonly payOS: PayOS,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createPaymentLink(dto: CreatePaymentDto) {
    try {
      const paymentData = {
        orderCode: dto.orderCode,
        amount: dto.amount,
        description: dto.description,
        buyerName: dto.buyerName,
        buyerEmail: dto.buyerEmail,
        buyerPhone: dto.buyerPhone,
        items: dto.items || [],
        returnUrl: dto.returnUrl || '',
        cancelUrl: dto.cancelUrl || '',
      };

      const response = await this.payOS.paymentRequests.create(paymentData);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create payment link: ${error.message}`,
      );
    }
  }

  async getPaymentInfo(orderCode: number) {
    try {
      const data = await this.payOS.paymentRequests.get(orderCode);
      return { success: true, data };
    } catch (error) {
      this.logger.error(`❌ Get payment info failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async cancelPayment(orderCode: number, reason?: string) {
    try {
      const data = await this.payOS.paymentRequests.cancel(orderCode, reason);
      this.logger.log(`🚫 Cancelled payment - orderCode: ${orderCode}`);
      return { success: true, data };
    } catch (error) {
      this.logger.error(`❌ Cancel payment failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async verifyWebhookData(webhookBody: WebhookPayosDto) {
    try {
      const webhookData = await this.payOS.webhooks.verify(webhookBody);
      return {
        success: true,
        data: webhookData,
      };
    } catch (error) {
      this.logger.error(`Webhook verify failed: ${error.message}`);
      throw new BadRequestException(
        `Invalid webhook signature: ${error.message}`,
      );
    }
  }

  async handlePaymentWebhook(webhookPayload: { success: boolean; data: WebhookPayosBody }) {
    const innerData = webhookPayload?.data ?? webhookPayload;
    const { code, orderCode } = innerData;

    if (code === '00') {
      await this.handlePaymentSuccess(orderCode);
    } else if (code === 'CANCELLED') {
      await this.handlePaymentCancelled(orderCode);
    } else {
      this.logger.warn(`⚠️ Unknown webhook code: ${code} - orderCode: ${orderCode}`);
    }
  }

  private async handlePaymentSuccess(orderCode: number) {
    const payment = await this.paymentRepo.findOne({
      where: { orderCode },
      relations: ['booking', 'booking.user', 'booking.event'],
    });

    if (!payment) {
      this.logger.warn(`Payment not found for orderCode: ${orderCode}`);
      return;
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      this.logger.log(`Payment already completed for orderCode: ${orderCode}`);
      return;
    }

    await this.paymentRepo.update(payment.id, { status: PaymentStatus.COMPLETED });
    await this.bookingRepo.update(payment.booking.id, { status: BookingStatus.CONFIRMED });

    const b = payment.booking;
    this.client
      .emit('booking.confirmed', {
        bookingId: b.id,
        userId: b.user.id,
        eventId: b.event.id,
        seatIds: b.seatIds,
        attendeeEmail: b.attendeeEmail,
        attendeeName: b.attendeeName,
        totalPrice: b.totalPrice,
      })
      .subscribe({
        error: (e) => this.logger.error('RabbitMQ emit failed', e),
      });

    this.logger.log(`💰 Payment SUCCESS - orderCode: ${orderCode}`);
  }

  private async handlePaymentCancelled(orderCode: number) {
    const payment = await this.paymentRepo.findOne({
      where: { orderCode },
      relations: ['booking', 'booking.event'],
    });

    if (!payment) {
      this.logger.warn(`Payment not found for orderCode: ${orderCode}`);
      return;
    }

    if (payment.status === PaymentStatus.CANCELLED) {
      this.logger.log(`Payment already cancelled for orderCode: ${orderCode}`);
      return;
    }

    const b = payment.booking;
    await this.paymentRepo.update(payment.id, { status: PaymentStatus.CANCELLED });
    await this.bookingRepo.update(b.id, { status: BookingStatus.CANCELLED });
    await this.seatRepo.update({ id: In(b.seatIds) }, { status: SeatStatus.AVAILABLE });
    await this.eventRepo.increment({ id: b.event.id }, 'availableSeats', b.seatIds.length);

    this.logger.warn(`🚫 Payment CANCELLED - orderCode: ${orderCode}`);
  }

  async confirmWebhook(webhookUrl: string) {
    try {
      const result = await this.payOS.webhooks.confirm(webhookUrl);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to confirm webhook: ${error.message}`,
      );
    }
  }
}
