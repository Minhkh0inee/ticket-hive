import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
        console.log(user)
        return await this.bookingsService.createBooking(createBookingDto, user.id)
    }
}
