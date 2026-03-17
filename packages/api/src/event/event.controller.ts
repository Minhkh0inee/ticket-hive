import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('events')
export class EventController {
    constructor(
        private readonly eventService: EventService
    ){}

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    createEvent(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User){
        return this.eventService.create(createEventDto, user.id)
    }

    @Get()
    getEvents(@Query() paginationDto: PaginationDto) {
        return this.eventService.findAll(paginationDto)
    }

    
    @Get(':id')
    getEvent(@Param('id', ParseUUIDPipe) id: string) {
        return this.eventService.findEventById(id)
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEventDto: UpdateEventDto) {
      return await this.eventService.update(id, updateEventDto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
      return await this.eventService.remove(id);
    }




}
