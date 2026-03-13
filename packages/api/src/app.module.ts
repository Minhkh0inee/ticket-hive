import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { SeatsModule } from './seats/seats.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AuthModule, EventModule, SeatsModule, BookingsModule, PaymentsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
