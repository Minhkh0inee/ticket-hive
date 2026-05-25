import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhookPayosDto } from 'src/payments/dto/webhook.dto';
import { PaymentsService } from 'src/payments/payments.service';

interface RequestWithWebhookData extends Request {
  webhookData: unknown;
}

@Injectable()
export class PaymentWebhookGuard implements CanActivate {
  constructor(private readonly paymentsService: PaymentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithWebhookData>();
    const body = req.body as unknown as WebhookPayosDto;
    try {
      const verifiedData = await this.paymentsService.verifyWebhookData(body);
      req.webhookData = verifiedData;

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new UnauthorizedException(message);
    }
  }
}
