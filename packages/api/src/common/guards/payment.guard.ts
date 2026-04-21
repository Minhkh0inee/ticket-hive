import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Webhook } from '@payos/node';
import { WebhookPayosDto } from 'src/payments/dto/webhook.dto';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class PaymentWebhookGuard implements CanActivate {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const body = req.body as unknown as WebhookPayosDto;
    try {
      const verifiedData = await this.paymentsService.verifyWebhookData(body);
      (req as any).webhookData = verifiedData;

      return true;
    } catch (error) {
      // The service already logged it, just re-throw
      throw new UnauthorizedException(error.message);
    }
  }
}