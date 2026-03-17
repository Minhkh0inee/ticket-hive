import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { SeatEventDto } from './dto/seat.dto';

@Injectable()
export class SeatsService {
    constructor(
        private readonly redisService: RedisService
    ){}

    async seatLock(seatId: string, body: SeatEventDto, userId: string) {
        const SEAT_LOCK_TTL = 10 * 60
        const {eventId} = body
        const locked = await this.redisService.seatLock(eventId, seatId, userId, SEAT_LOCK_TTL); 
        if (!locked) throw new ConflictException('Seat is already locked by another user');
        return { message: 'Seat locked successfully' };
    }

    async seatUnlock(seatId: string, body: SeatEventDto, userId: string) {
        const {eventId} = body
        const unlocked = await this.redisService.seatUnlock(eventId, seatId, userId); 
        if (!unlocked) throw new ForbiddenException('You do not own this seat lock');
        return { message: 'Seat unlocked successfully' };    
    }
}
