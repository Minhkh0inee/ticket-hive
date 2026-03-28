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

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds)
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async clearByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) await this.redis.del(...keys)
  }
}
