import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PayOS, Webhook } from '@payos/node';
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
        returnUrl: dto.returnUrl || "",
        cancelUrl: dto.cancelUrl || ""
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
      this.logger.debug('CHECKSUM_KEY đang dùng:')
      throw new BadRequestException(
        `Invalid webhook signature: ${error.message}`,
      );
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
