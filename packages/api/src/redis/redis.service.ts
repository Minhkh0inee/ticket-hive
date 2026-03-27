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

  async seatUnlock(eventId: string, seatId: string, userId: string): Promise<boolean> {
    const script = `
      if redis.call('get', KEYS[1]) == ARGV[1] then
        return redis.call('del', KEYS[1])
      else
        return 0
      end
    `;
  
    const result = await this.redis.eval(
      script,
      1,
      `seat_lock:${eventId}:${seatId}`,
      userId,
    );
  
    return result === 1;
  }

  async getSeatLock(eventId: string, seatId: string): Promise<string | null> {
    return this.redis.get(`seat_lock:${eventId}:${seatId}`);
  }

  async getManyLocks(keys: string[]): Promise<(string | null)[]> {
    return this.redis.mget(...keys);
  }

  async getManySeatLocks(eventId: string, seatIds: string[]): Promise<(string | null)[]> {
    const keys = seatIds.map((seatId) => `seat_lock:${eventId}:${seatId}`);
    return this.redis.mget(...keys);
  }

  async setEvent(eventId: string, data: any, ttlSeconds: number) {
    await this.redis.set(
      `event:${eventId}`, 
      JSON.stringify(data), 
      'EX', 
      ttlSeconds
    );
  }

  async getEvent(eventId: string): Promise<any | null> {
    const data = await this.redis.get(`event:${eventId}`);
    return data ? JSON.parse(data) : null;
  }

  async clearByPattern(pattern: string) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
