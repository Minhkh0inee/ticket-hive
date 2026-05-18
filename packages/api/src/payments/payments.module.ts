import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentWebhookGuard } from 'src/common/guards/payment.guard';
import { PayOS } from '@payos/node';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Booking } from '../bookings/entities/bookings.entity';
import { Seat } from '../seats/entities/seats.entity';
import { Event } from '../event/entities/event.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Booking, Seat, Event]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
          },
        },
      },
    ]),
  ],
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

        if (!clientId || !apiKey || !checksumKey) {
          throw new Error(
            `Missing PayOS env: clientId=${clientId}, apiKey=${apiKey}, checksumKey=${checksumKey}`,
          );
        }

        return new PayOS({ clientId, apiKey, checksumKey });
      },
    },
  ],
  exports: ['PAYOS_CLIENT', PaymentsService, ClientsModule],
})
export class PaymentsModule {}
