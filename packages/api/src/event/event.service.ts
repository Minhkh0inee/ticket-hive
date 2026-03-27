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
        const { categoryId, ...rest } = dto;
        const event = this.eventRepo.create({
          ...rest,
          availableSeats: dto.totalSeats,
          organizer: { id: organizerId },
          category: categoryId ? { id: categoryId } as any : null,
        });
        const saved = await this.eventRepo.save(event);
        await this.elasticService.indexEvent(saved);

        return saved;
    }

    async findAll(paginationDto: PaginationDto): Promise<IPaginatedResult<Event>>  {
        const { limit = 9, offset = 0, category, city, search, tag, ignoreIds, dateFilter } = paginationDto

        const query = this.eventRepo.createQueryBuilder('event')
            .leftJoinAndSelect('event.category', 'category')
            .where('event.deletedAt IS NULL')

        if (category) {
            query.andWhere('category.slug = :category', { category })
        }
        if (city) {
            query.andWhere('event.city ILIKE :city', { city: `%${city}%` })
        }
        if (search) {
            query.andWhere(
            '(event.title ILIKE :search OR event.venue ILIKE :search)',
            { search: `%${search}%` }
            )
        }
        if (tag) {
            query.andWhere('event.tag = :tag', { tag })
        }
        if (ignoreIds && ignoreIds.length > 0) {
            query.andWhere('event.id NOT IN (:...ignoreIds)', { ignoreIds })
        }
        if (dateFilter) {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            let start: Date;
            if (dateFilter === 'this_month') {
                start = new Date(now.getFullYear(), now.getMonth(), 1);
            } else {
                const day = now.getDay();
                const diff = day === 0 ? -6 : 1 - day;
                start = new Date(now);
                start.setDate(now.getDate() + diff);
                start.setHours(0, 0, 0, 0);
            }
            query.andWhere('event.eventDate >= :start', { start })
                 .andWhere('event.eventDate <= :end', { end })
        }

        const [data, total] = await query
            .orderBy('event.eventDate', 'ASC')
            .skip(offset)
            .take(limit)
            .getManyAndCount()

        return { data, total, limit, offset, totalPages: Math.ceil(total / limit) }
    }

    async findEventById(id: string): Promise<Event>  {
        const event = await this.eventRepo.findOne({where: {id}, relations: ['organizer', 'category']})
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
