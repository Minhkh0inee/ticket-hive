import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { SeatEventDto } from './dto/seat.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeatsService {
  private readonly seatLockTtl: number;
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.seatLockTtl = this.configService.get<number>(
      'SEAT_LOCK_TTL_SECONDS',
      600,
    );
  }

  async seatLock(seatId: string, body: SeatEventDto, userId: string) {
    const { eventId } = body;
    const locked = await this.redisService.seatLock(
      eventId,
      seatId,
      userId,
      this.seatLockTtl,
    );
    if (!locked)
      throw new ConflictException('Seat is already locked by another user');
    return { message: 'Seat locked successfully' };
  }

  async seatUnlock(seatId: string, body: SeatEventDto, userId: string) {
    const { eventId } = body;
    const unlocked = await this.redisService.seatUnlock(
      eventId,
      seatId,
      userId,
    );
    if (!unlocked)
      throw new ForbiddenException('You do not own this seat lock');
    return { message: 'Seat unlocked successfully' };
  }
}
