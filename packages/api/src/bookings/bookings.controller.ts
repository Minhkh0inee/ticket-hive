import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('bookings')
export class BookingsController {
    constructor(
        private readonly bookingsService: BookingsService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createBooking(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: User){
        return await this.bookingsService.createBooking(createBookingDto, user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    async getMyBookings(@CurrentUser() user: User) {
        return this.bookingsService.getMyBookings(user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getBookingById(
        @Param('id') id: string,
        @CurrentUser() user: User
    ) {
        return this.bookingsService.getBookingById(id, user.id)
    }
}
