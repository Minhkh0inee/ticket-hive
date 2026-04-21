import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentWebhookGuard } from 'src/common/guards/payment.guard';
import { PayOS } from '@payos/node';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentWebhookGuard,
    {
      provide: 'PAYOS_CLIENT',
      useFactory: () => {
        const clientId = process.env.PAYOS_CLIENT_ID;
        const apiKey = process.env.PAYOS_API_KEY;
        const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

        console.log({ clientId, apiKey, checksumKey }); // 👈 log hết ra

        if (!clientId || !apiKey || !checksumKey) {
          throw new Error(
            `Missing PayOS env: clientId=${clientId}, apiKey=${apiKey}, checksumKey=${checksumKey}`,
          );
        }

        return new PayOS({ clientId, apiKey, checksumKey });
      },
    },
  ],
  exports: ['PAYOS_CLIENT'],
})
export class PaymentsModule {}
