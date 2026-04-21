import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PayOS } from '@payos/node';
import { WebhookPayosDto } from './dto/webhook.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(@Inject('PAYOS_CLIENT') private readonly payOS: PayOS) {}

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

  verifyWebhookData(webhookBody: WebhookPayosDto) {
    try {
      const webhookData = this.payOS.webhooks.verify(webhookBody);
      return {
        success: true,
        data: webhookData,
      };
    } catch (error) {
      this.logger.error(`Webhook verify failed: ${error.message}`);
      this.logger.debug('Webhook body nhận được:', JSON.stringify(webhookBody));
      this.logger.debug('CHECKSUM_KEY đang dùng:');
      throw new BadRequestException(
        `Invalid webhook signature: ${error.message}`,
      );
    }
  }

    async handlePaymentWebhook(data: any) {
    const { code, orderCode, amount } = data;

    if (code === '00') {
      // Thanh toán thành công
      this.logger.log(`💰 Payment SUCCESS - orderCode: ${orderCode}, amount: ${amount}`);

      // TODO: Cập nhật trạng thái đơn hàng trong DB
      // await this.ordersService.markAsPaid(orderCode);

      // TODO: Gửi email xác nhận
      // await this.mailService.sendConfirmation(orderCode);

    } else if (code === 'CANCELLED') {
      // Đơn bị huỷ
      this.logger.warn(`🚫 Payment CANCELLED - orderCode: ${orderCode}`);

      // TODO: Cập nhật trạng thái đơn hàng
      // await this.ordersService.markAsCancelled(orderCode);

    } else {
      this.logger.warn(`⚠️ Unknown webhook code: ${code} - orderCode: ${orderCode}`);
    }
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
