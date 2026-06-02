import {
  ConflictException,
  ForbiddenException,
  Injectable,
  MessageEvent,
} from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { SeatEventDto } from './dto/seat.dto';
import { ConfigService } from '@nestjs/config';
import { Observable, Subject, filter, map } from 'rxjs';
import { SeatStatus } from './entities/seats.entity';

@Injectable()
export class SeatsService {
  private readonly seatLockTtl: number;
  private seatUpdates$ = new Subject<{ eventId: string; seatIds: string[]; status: SeatStatus }>();
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

  getSeatUpdateStream(eventId: string): Observable<MessageEvent> {
    return this.seatUpdates$.pipe(
      filter(update => update.eventId === eventId),
      map(update => ({ data: update })),
    );
  }

  // Gọi sau khi booking thành công
  emitSeatUpdate(eventId: string, seatIds: string[], status: SeatStatus) {
    this.seatUpdates$.next({ eventId, seatIds, status });
  }
}
