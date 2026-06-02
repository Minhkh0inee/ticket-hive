import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventStatus } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPaginatedResult } from 'src/common/interface/pagination.interface';
import { RedisService } from 'src/redis/redis.service';
import { ElasticService } from 'src/elasticsearch/elasticsearch.service';
import { SearchEventDto } from 'src/elasticsearch/dto/search-event.dto';
import { Category } from 'src/categories/entities/category.entity';
import { HomepageData, SeatWithLock } from './entities/homepage';
import { SelectQueryBuilder } from 'typeorm/browser';
import { RedisKeys, RedisTTL } from 'src/common/constant/redis-key.constant';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    private readonly redisService: RedisService,
    private readonly elasticService: ElasticService,
  ) {}

  async create(dto: CreateEventDto, organizerId: string): Promise<Event> {
    const { categoryId, ...rest } = dto;
    const event = this.eventRepo.create({
      ...rest,
      availableSeats: dto.totalSeats,
      organizer: { id: organizerId },
      category: categoryId ? ({ id: categoryId } as Category) : null,
    });
    const saved = await this.eventRepo.save(event);

    await Promise.all([
      this.elasticService.indexEvent(saved),
      this.invalidateListCaches(),
    ]);

    return saved;
  }

  async findAll(dto: PaginationDto): Promise<IPaginatedResult<Event>> {
    const {
      limit = 9,
      offset = 0,
      category,
      city,
      search,
      tag,
      dateFilter,
    } = dto;
    const filterKey = this.buildFilterKey({
      category,
      city,
      search,
      tag,
      dateFilter,
    });
    const cacheKey = RedisKeys.event.list(offset, limit, filterKey);

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      this.logger.log('🔥 Cache Hit: events list');
      return JSON.parse(cached) as IPaginatedResult<Event>;
    }

    this.logger.log('❄️ Cache Miss: events list → PostgreSQL');

    const query = this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.category', 'category')
      .where('event.deletedAt IS NULL');

    if (category) query.andWhere('category.slug = :category', { category });
    if (city) query.andWhere('event.city ILIKE :city', { city: `%${city}%` });
    if (search)
      query.andWhere(
        '(event.title ILIKE :search OR event.venue ILIKE :search)',
        { search: `%${search}%` },
      );
    if (tag) query.andWhere('event.tag = :tag', { tag });
    if (dateFilter) this.applyDateFilter(query, dateFilter);

    const [data, total] = await query
      .orderBy('event.eventDate', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const result = {
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    };

    await this.redisService.set(
      cacheKey,
      JSON.stringify(result),
      RedisTTL.event.list,
    );
    return result;
  }

  async findEventById(id: string): Promise<Event> {
    const cacheKey = RedisKeys.event.item(id);

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      this.logger.log(`🔥 Cache Hit: events:item:${id}`);
      return JSON.parse(cached) as Event;
    }

    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['organizer', 'category'],
    });
    if (!event) throw new NotFoundException(`Event ${id} not found`);

    await this.redisService.set(
      cacheKey,
      JSON.stringify(event),
      RedisTTL.event.item,
    );
    return event;
  }

  async findByTag(tag: string, limit: number): Promise<Event[]> {
    const cacheKey = RedisKeys.event.tag(tag);
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      this.logger.log(`🔥 Cache Hit: events:tag:${tag}`);
      return JSON.parse(cached) as Event[];
    }

    const data = await this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.category', 'category')
      .where('event.deletedAt IS NULL')
      .andWhere('event.tag = :tag', { tag })
      .orderBy('event.eventDate', 'ASC')
      .take(limit)
      .getMany();

    await this.redisService.set(
      cacheKey,
      JSON.stringify(data),
      RedisTTL.event.tag,
    );
    return data;
  }

  async getHomepageData(): Promise<HomepageData> {
    const cacheKey = RedisKeys.event.homepage;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      this.logger.log('🔥 Cache Hit: events:homepage');
      // FIX: Cast return
      return JSON.parse(cached) as HomepageData;
    }

    const [featured, trending, newest, special] = await Promise.all([
      this.findByTag('featured', 4),
      this.findByTag('trending', 4),
      this.findByTag('new', 12),
      this.findByTag('special', 12),
    ]);

    const result: HomepageData = { featured, trending, newest, special };
    await this.redisService.set(
      cacheKey,
      JSON.stringify(result),
      RedisTTL.event.homepage,
    );
    return result;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findEventById(id);
    Object.assign(event, dto);
    const saved = await this.eventRepo.save(event);

    await Promise.all([
      this.elasticService.updateEvent(saved),
      this.invalidateEventCache(id),
    ]);

    return saved;
  }

  async remove(id: string): Promise<void> {
    const event = await this.findEventById(id);
    await this.eventRepo.update(id, { status: EventStatus.CANCELLED });
    await this.eventRepo.softRemove(event);

    await Promise.all([
      this.elasticService.deleteEvent(id),
      this.invalidateEventCache(id),
    ]);
  }

  async getSeatsByEventId(eventId: string): Promise<SeatWithLock[]> {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['seats'],
    });
    if (!event) throw new NotFoundException(`Event ${eventId} not found`);

    const keys = event.seats.map((seat) => `seat_lock:${event.id}:${seat.id}`);
    const lockValues = await this.redisService.getManyLocks(keys);

    return event.seats.map((seat, index) => ({
      ...seat,
      isLocked: !!lockValues[index],
      lockedBy: lockValues[index] ?? null,
    }));
  }

  async search(dto: SearchEventDto) {
    return this.elasticService.searchEvents(dto);
  }

  async reIndexAll() {
    const events = await this.eventRepo.find();
    await this.elasticService.bulkIndexEvents(events);
    return { message: `Reindexed ${events.length} events` };
  }

  private applyDateFilter(
    query: SelectQueryBuilder<Event>,
    dateFilter: string,
  ) {
    const now = new Date();
    let start: Date;
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    if (dateFilter === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      start = new Date(now);
      start.setDate(now.getDate() + diff);
      start.setHours(0, 0, 0, 0);
    }

    query
      .andWhere('event.eventDate >= :start', { start })
      .andWhere('event.eventDate <= :end', { end });
  }

  private buildFilterKey(filters: Record<string, any>): string {
    return (
      Object.entries(filters)
        .filter(([, v]) => v !== undefined && v !== null)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join(':') || 'all'
    );
  }

  private async invalidateEventCache(eventId?: string) {
    try {
      await Promise.all([
        ...(eventId
          ? [this.redisService.del(RedisKeys.event.item(eventId))]
          : []),
        this.redisService.clearByPattern(RedisKeys.event.patterns.allList),
        this.redisService.clearByPattern(RedisKeys.event.patterns.allTag),
        this.redisService.del(RedisKeys.event.homepage),
      ]);
    } catch (error) {
      this.logger.warn(
        `Cache invalidation failed${eventId ? ` for event ${eventId}` : ''}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  private async invalidateListCaches() {
    await this.invalidateEventCache();
  }
}
