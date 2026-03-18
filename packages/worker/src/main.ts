import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: 'main_queue',
      queueOptions: {
        durable: false
      },
      noAck: false,
    },
  });
  await app.listen(); 
  console.log('🚀 Worker is listening on main_queue...');
  
}
bootstrap();
