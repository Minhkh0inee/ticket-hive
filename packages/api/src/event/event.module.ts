import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
