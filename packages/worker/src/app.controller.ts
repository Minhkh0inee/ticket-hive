import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('test')
  handleTest(@Payload() data: any) {
    console.log('✅ Worker nhận được:', data);
  }

  @EventPattern('booking.confirmed')
  handleBookingConfirmed(@Payload() data: any) {
    console.log('✅ Worker handleBookingConfirmed nhận được:', data);
  }
}
