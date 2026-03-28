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

const CacheKeys = {
  eventList:  (offset: number, limit: number, filters: string) =>
    `events:list:${offset}:${limit}:${filters}`,
  eventItem:  (id: string) => `events:item:${id}`,
  eventTag:   (tag: string) => `events:tag:${tag}`,
  allListPattern: 'events:list:*',
  allTagPattern:  'events:tag:*',
}

const TTL = {
  list:   300,   // 5 phút
  item:   3600,  // 1 giờ
  tag:    300,   // 5 phút
}

@Injectable()
export class EventService implements OnModuleInit {
    private readonly logger = new Logger(EventService.name);
    private readonly LIST_CACHE_PREFIX = 'events_list';
    private readonly ITEM_CACHE_PREFIX = 'event_item';
    constructor(
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
        private readonly redisService: RedisService,
        private readonly elasticService: ElasticService,
    ) { }

    async onModuleInit() {
        await this.syncAllEventsToElastic();
    }

    async create(dto: CreateEventDto, organizerId: string): Promise<Event> {
        const { categoryId, ...rest } = dto
        const event = this.eventRepo.create({
        ...rest,
        availableSeats: dto.totalSeats,
        organizer: { id: organizerId },
        category: categoryId ? { id: categoryId } as any : null,
        })
        const saved = await this.eventRepo.save(event)

        await Promise.all([
        this.elasticService.indexEvent(saved),
        this.invalidateListCaches(),
        ])

        return saved
    }

    async findAll(dto: PaginationDto): Promise<IPaginatedResult<Event>> {
        const { limit = 9, offset = 0, category, city, search, tag, dateFilter } = dto
        const filterKey = this.buildFilterKey({ category, city, search, tag, dateFilter })
        const cacheKey  = CacheKeys.eventList(offset, limit, filterKey)

        const cached = await this.redisService.get(cacheKey)
        if (cached) {
        this.logger.log('🔥 Cache Hit: events list')
        return JSON.parse(cached)
        }
        this.logger.log('❄️ Cache Miss: events list → PostgreSQL')

        const query = this.eventRepo.createQueryBuilder('event')
        .leftJoinAndSelect('event.category', 'category')
        .where('event.deletedAt IS NULL')

        if (category)   query.andWhere('category.slug = :category', { category })
        if (city)       query.andWhere('event.city ILIKE :city', { city: `%${city}%` })
        if (search)     query.andWhere('(event.title ILIKE :search OR event.venue ILIKE :search)', { search: `%${search}%` })
        if (tag)        query.andWhere('event.tag = :tag', { tag })
        if (dateFilter) this.applyDateFilter(query, dateFilter)

        const [data, total] = await query
        .orderBy('event.eventDate', 'ASC')
        .skip(offset)
        .take(limit)
        .getManyAndCount()

        const result = { data, total, limit, offset, totalPages: Math.ceil(total / limit) }

        await this.redisService.set(cacheKey, JSON.stringify(result), TTL.list)

        return result
    }

    async findEventById(id: string): Promise<Event> {
        const cacheKey = CacheKeys.eventItem(id)

        const cached = await this.redisService.get(cacheKey)
        if (cached) {
        this.logger.log(`🔥 Cache Hit: events:item:${id}`)
        return JSON.parse(cached)
        }

        const event = await this.eventRepo.findOne({
        where: { id },
        relations: ['organizer', 'category'],
        })
        if (!event) throw new NotFoundException(`Event ${id} not found`)

        await this.redisService.set(cacheKey, JSON.stringify(event), TTL.item)

        return event
    }

    async findByTag(tag: string, limit: number): Promise<Event[]> {
        const cacheKey = CacheKeys.eventTag(tag)

        const cached = await this.redisService.get(cacheKey)
        if (cached) {
        this.logger.log(`🔥 Cache Hit: events:tag:${tag}`)
        return JSON.parse(cached)
        }
        this.logger.log(`❄️ Cache Miss: events:tag:${tag} → PostgreSQL`)

        const data = await this.eventRepo
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.category', 'category')
        .where('event.deletedAt IS NULL')
        .andWhere('event.tag = :tag', { tag })
        .orderBy('event.eventDate', 'ASC')
        .take(limit)
        .getMany()

        await this.redisService.set(cacheKey, JSON.stringify(data), TTL.tag)

        return data
    }

    async update(id: string, dto: UpdateEventDto): Promise<Event> {
        const event = await this.findEventById(id)
        Object.assign(event, dto)
        const saved = await this.eventRepo.save(event)

        await Promise.all([
        this.elasticService.updateEvent(saved),
        this.redisService.set(CacheKeys.eventItem(id), JSON.stringify(saved), TTL.item),
        this.invalidateListCaches(),
        ])

        return saved
    }

    async remove(id: string): Promise<void> {
        const event = await this.findEventById(id)
        await this.eventRepo.softRemove(event)  

        await Promise.all([
        this.elasticService.deleteEvent(id),
        this.redisService.del(CacheKeys.eventItem(id)),
        this.invalidateListCaches(),
        ])
    }

    async getSeatsByEventId(eventId: string): Promise<any> {
        const event = await this.eventRepo.findOne({
        where: { id: eventId },
        relations: ['seats'],
        })
        if (!event) throw new NotFoundException(`Event ${eventId} not found`)

        const keys = event.seats.map(seat => `seat_lock:${event.id}:${seat.id}`)
        const lockValues = await this.redisService.getManyLocks(keys)

        return event.seats.map((seat, index) => ({
            ...seat,
            isLocked: !!lockValues[index],
            lockedBy: lockValues[index] ?? null,
        }))
    }

    async search(dto: SearchEventDto) {
        return this.elasticService.searchEvents(dto);
    }

    private applyDateFilter(query: any, dateFilter: string) {
        const now = new Date()
        let start: Date
        const end = new Date(now)
        end.setHours(23, 59, 59, 999)

        if (dateFilter === 'this_month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        } else {
        const day = now.getDay()
        const diff = day === 0 ? -6 : 1 - day
        start = new Date(now)
        start.setDate(now.getDate() + diff)
        start.setHours(0, 0, 0, 0)
        }

        query
        .andWhere('event.eventDate >= :start', { start })
        .andWhere('event.eventDate <= :end', { end })
    }

    private buildFilterKey(filters: Record<string, any>): string {
        return Object.entries(filters)
        .filter(([, v]) => v !== undefined && v !== null)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join(':')
        || 'all'
    }

    private async invalidateListCaches() {
        await Promise.all([
        this.redisService.clearByPattern(CacheKeys.allListPattern),
        this.redisService.clearByPattern(CacheKeys.allTagPattern),
        ])
    }

    private async syncAllEventsToElastic() {
        const events = await this.eventRepo.find()
        await this.elasticService.bulkIndexEvents(events)
        this.logger.log(`✅ Synced ${events.length} events to Elasticsearch`)
    }

}
