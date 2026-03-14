import { Module } from '@nestjs/common';
import { SeatsController } from './seats.controller';

@Module({
  controllers: [SeatsController]
})
export class SeatsModule {}
