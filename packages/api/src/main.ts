import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 8080
  const env = process.env.NODE_ENV || 'development';
  await app.listen(port);
  console.log(`🚀 Server running on port ${port} [${env}]`);
}
bootstrap();
