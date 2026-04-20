import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as amqplib from 'amqplib'; // Use this style for compatibility

async function assertQueues() {
  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error('RABBITMQ_URL not found');

  const conn = await amqplib.connect(url);
  const ch = await conn.createChannel();

  await ch.assertQueue('booking.confirmed.dlq', { durable: true });

  await ch.close();
  await conn.close();
}

async function bootstrap() {
  try {
    await assertQueues();

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
          noAck: false,
        },
      },
    );
    await app.listen();
    console.log('🚀 Worker is listening on main_queue...');
  } catch (error) {
    console.error('❌ Worker failed to start:', error);
    process.exit(1);
  }
}

// 5. Fix the "floating promise" warning by adding a .catch()
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
