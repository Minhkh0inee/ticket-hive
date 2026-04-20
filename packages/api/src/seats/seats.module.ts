import { Module } from '@nestjs/common';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seats.entity';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Seat])],
  controllers: [SeatsController],
  providers: [SeatsService, RedisService],
})
export class SeatsModule {}
