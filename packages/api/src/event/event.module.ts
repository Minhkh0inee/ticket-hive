import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { ElasticModule } from 'src/elasticsearch/elasticsearch.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), RedisModule, ElasticModule],
  controllers: [EventController],
  providers: [EventService, RedisService],
  exports: [EventService],
})
export class EventModule {}
