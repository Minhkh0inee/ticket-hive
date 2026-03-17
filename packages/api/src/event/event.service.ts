import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPaginatedResult } from 'src/common/interface/pagination.interface';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>
    ){}

    async create(dto: CreateEventDto, organizerId: string): Promise<Event>  {
        const event = this.eventRepo.create({
          ...dto,
          availableSeats: dto.totalSeats,
          organizer: { id: organizerId },
        });
        return await this.eventRepo.save(event);
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
        console.log(id)
        const event = await this.eventRepo.findOne({where: {id}})
        if(!event) throw new NotFoundException(`Event with ${id} not found`);
        return event
    }

    async update(id: string, dto: UpdateEventDto): Promise<Event> {
        const event = await this.findEventById(id);
        Object.assign(event, dto);
        return await this.eventRepo.save(event);
    }

    async remove(id: string): Promise<void> {
        const event = await this.findEventById(id);
        await this.eventRepo.remove(event);
    }
}
