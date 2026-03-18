import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPaginatedResult } from 'src/common/interface/pagination.interface';
import { RedisService } from 'src/redis/redis.service';
import { ElasticService } from 'src/elasticsearch/elasticsearch.service';
import { SearchEventDto } from 'src/elasticsearch/dto/search-event.dto';

@Injectable()
export class EventService implements OnModuleInit{
    private readonly logger = new Logger(EventService.name);
    constructor(
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
        private readonly redisService: RedisService,
        private readonly elasticService: ElasticService,
    ){}

    async onModuleInit() {
        await this.syncAllEventsToElastic();
      }

    async create(dto: CreateEventDto, organizerId: string): Promise<Event>  {
        const event = this.eventRepo.create({
          ...dto,
          availableSeats: dto.totalSeats,
          organizer: { id: organizerId },
        });
        const saved = await this.eventRepo.save(event);
        await this.elasticService.indexEvent(saved);

        return saved;
    }

    async findAll(paginationDto: PaginationDto): Promise<IPaginatedResult<Event>>  {
        const { limit = 10, offset = 0 } = paginationDto;
        const [data, total] = await this.eventRepo.findAndCount({
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' }
        })
        return { data, total, limit, offset };
    }

    async findEventById(id: string): Promise<Event>  {
        const event = await this.eventRepo.findOne({where: {id}})
        if(!event) throw new NotFoundException(`Event with ${id} not found`);
        return event
    }

    async update(id: string, dto: UpdateEventDto): Promise<Event> {
        const event = await this.findEventById(id);
        Object.assign(event, dto);
        const saved = await this.eventRepo.save(event);

        await this.elasticService.updateEvent(saved);
      
        return saved;
    }

    async remove(id: string): Promise<void> {
        const event = await this.findEventById(id);
        await this.eventRepo.remove(event);
        await this.elasticService.deleteEvent(id);
    }

    async getSeatsByEventId(eventId: string): Promise<any>{
        const event = await this.eventRepo.findOne({where: {id: eventId}, relations: ['seats']})
        if (!event) throw new NotFoundException(`Event ${eventId} not found`);
        
        const seats = await this.normalizeGetSeatsFromRedis(event)
        
        return seats;
    }

    async search(dto: SearchEventDto) {
        return this.elasticService.searchEvents(dto);
      }

    private async normalizeGetSeatsFromRedis(event: Event) {
        const keys = event.seats.map((seat) => `seat_lock:${event.id}:${seat.id}`);
        const lockValues = await this.redisService.getManyLocks(keys);
        return event.seats.map((seat, index) => ({
          ...seat,
          isLocked: !!lockValues[index],
          lockedBy: lockValues[index] ?? null,
        }));
    }

    private async syncAllEventsToElastic() {
        const events = await this.eventRepo.find();
        await this.elasticService.bulkIndexEvents(events);
        this.logger.log(`✅ Synced ${events.length} events to Elasticsearch`);
      }
}
