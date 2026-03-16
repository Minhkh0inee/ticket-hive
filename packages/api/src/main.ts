import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exeception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 8080
  const env = process.env.NODE_ENV || 'development';
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port);
  console.log(`🚀 Server running on port ${port} [${env}]`);
}
bootstrap();
