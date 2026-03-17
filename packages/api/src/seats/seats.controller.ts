import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { SeatsService } from './seats.service';
import { SeatEventDto } from './dto/seat.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/lock')
  async seatLock(
    @Param('id', ParseUUIDPipe) seatId: string,
    @CurrentUser() user: User,
    @Body() seatDto: SeatEventDto,
  ) {
    return this.seatsService.seatLock(seatId, seatDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unlock')
  async seatUnlock(
    @Param('id', ParseUUIDPipe) seatId: string,
    @CurrentUser() user: User,
    @Body() seatDto: SeatEventDto,
  ) {
    return this.seatsService.seatUnlock(seatId, seatDto, user.id);
  }
}
