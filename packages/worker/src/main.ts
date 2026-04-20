import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as amqp from 'amqplib';

async function assertQueues() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL as string);
  const ch = await conn.createChannel();
  // DLQ must be asserted before the consumer tries to publish to it
  await ch.assertQueue('booking.confirmed.dlq', { durable: true });
  await ch.close();
  await (conn as any).close();
}

async function bootstrap() {
  await assertQueues();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
      noAck: false,
    },
  });
  await app.listen();
  console.log('🚀 Worker is listening on main_queue...');
}
bootstrap();
