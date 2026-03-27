import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { ELASTIC_CLIENT } from './elasticsearch.constant';
import { Event } from 'src/event/entities/event.entity';
import { SearchEventDto } from './dto/search-event.dto';
const EVENT_INDEX = 'events';
@Injectable()
export class ElasticService implements OnModuleInit {
  private readonly logger = new Logger(ElasticService.name);

  constructor(@Inject(ELASTIC_CLIENT) private readonly client: Client) {}

async onModuleInit() {
    try {
      const response = await this.client.cluster.health();
      this.logger.log(`✅ Search Cluster connected — status: ${response.body.status}`);
      await this.createEventIndex();
    } catch (error) {
      this.logger.error('❌ Search Cluster connection failed', error);
    }
  }

  async indexEvent(event: Event) {
    await this.client.index({
      index: EVENT_INDEX,
      id: event.id,
      body: this.toDocument(event),
    });
  }

  async bulkIndexEvents(events: Event[]) {
    if (events.length === 0) return;

    const operations = events.flatMap((event) => [
      { index: { _index: EVENT_INDEX, _id: event.id } },
      this.toDocument(event),
    ]);

    const { body: result } = await this.client.bulk({ body: operations });

    if (result.errors) {
      this.logger.error('Bulk index errors:', result.items);
    } else {
      this.logger.log(`✅ Bulk indexed ${events.length} events`);
    }
  }

  async updateEvent(event: Event) {
    await this.client.update({
      index: EVENT_INDEX,
      id: event.id,
      body: { doc: this.toDocument(event) },
    });
  }

  async deleteEvent(eventId: string) {
    await this.client.delete({
      index: EVENT_INDEX,
      id: eventId,
    });
  }

  async searchEvents(dto: SearchEventDto) {
    const { q, city, category, minPrice, maxPrice, limit = 10, offset = 0 } = dto;
  
    const must: any[] = [];
    const filter: any[] = [];
  
    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: ['title^3', 'description', 'venue'], 
          type: 'cross_fields',
          operator: 'and',
        },
      });
    }
  
    if (city) {
      filter.push({ term: { city } });
    }
  
    if (category) {
      filter.push({ term: { category } });
    }
  
    // filter price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.push({
        range: {
          basePrice: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        },
      });
    }
  
const { body: result } = await this.client.search({
      index: EVENT_INDEX,
      from: offset,
      size: limit,
      body: { // Use 'body' for the query object
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
        sort: [{ eventDate: { order: 'asc' } }],
      }
    });
  
    const hits = result.hits.hits;
    const total = typeof result.hits.total === 'number'
      ? result.hits.total
      : result.hits.total?.value ?? 0;
  
    return {
      data: hits.map((hit) => hit._source),
      total,
      limit,
      offset,
    };
  }

  private toDocument(event: Event) {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      venue: event.venue,
      city: event.city,
      category: event.category?.slug ?? null,
      eventDate: event.eventDate,
      bannerUrl: event.bannerUrl,
      totalSeats: event.totalSeats,
      availableSeats: event.availableSeats,
      basePrice: Number(event.basePrice),
      organizerId: event.organizer?.id ?? null,
      createdAt: event.createdAt,
    };
  }
  private async createEventIndex() {
    const exists = await this.client.indices.exists({ index: EVENT_INDEX });

    if (exists) {
      this.logger.log(`Index "${EVENT_INDEX}" already exists — skipping`);
      return;
    }

    await this.client.indices.create({
      index: EVENT_INDEX,
      body: { 
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: { type: 'text', analyzer: 'standard' },
            description: { type: 'text', analyzer: 'standard' },
            venue: { type: 'text', analyzer: 'standard' },
            city: { type: 'keyword' },
            category: { type: 'keyword' },
            eventDate: { type: 'date' },
            bannerUrl: { type: 'keyword', index: false },
            totalSeats: { type: 'integer' },
            availableSeats: { type: 'integer' },
            basePrice: { type: 'double' },
            organizerId: { type: 'keyword' },
            createdAt: { type: 'date' },
          },
        },
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
      }
    });

    this.logger.log(`✅ Index "${EVENT_INDEX}" created`);
  }
}
