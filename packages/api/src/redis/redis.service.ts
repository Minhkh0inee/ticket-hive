import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setRefreshToken(userId: string, token: string, ttlSeconds: number) {
    await this.redis.set(`refresh:${userId}`, token, 'EX', ttlSeconds);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.redis.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(userId: string) {
    await this.redis.del(`refresh:${userId}`);
  }

  async seatLock(
    eventId: string,
    seatId: string,
    userId: string,
    ttlSeconds: number,
  ): Promise<boolean> {
    const result = await this.redis.set(
      `seat_lock:${eventId}:${seatId}`,
      userId,
      'EX',
      ttlSeconds,
      'NX',
    );
    return result === 'OK';
  }

  async seatUnlock(
    eventId: string,
    seatId: string,
    userId: string,
  ): Promise<boolean> {
    const owner = await this.redis.get(`seat_lock:${eventId}:${seatId}`);
    if (owner !== userId) return false;
    await this.redis.del(`seat_lock:${eventId}:${seatId}`);
    return true;
  }

  async getSeatLock(eventId: string, seatId: string): Promise<string | null> {
    return this.redis.get(`seat_lock:${eventId}:${seatId}`);
  }
}
