import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisKeys } from 'src/common/constant/redis-key.constant';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setRefreshToken(userId: string, token: string, ttlSeconds: number) {
    await this.redis.set(RedisKeys.auth.refreshToken(userId), token, 'EX', ttlSeconds);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.redis.get(RedisKeys.auth.refreshToken(userId));
  }

  async deleteRefreshToken(userId: string) {
    await this.redis.del(RedisKeys.auth.refreshToken(userId));
  }

  async seatLock(
    eventId: string,
    seatId: string,
    userId: string,
    ttlSeconds: number,
  ): Promise<boolean> {
    const result = await this.redis.set(
      RedisKeys.seat.lock(eventId, seatId),
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
      RedisKeys.seat.lock(eventId, seatId),
      userId,
    );

    return result === 1;
  }

  async getSeatLock(eventId: string, seatId: string): Promise<string | null> {
    return this.redis.get(RedisKeys.seat.lock(eventId, seatId));
  }

  async getManyLocks(keys: string[]): Promise<(string | null)[]> {
    return this.redis.mget(...keys);
  }

  async getManySeatLocks(
    eventId: string,
    seatIds: string[],
  ): Promise<(string | null)[]> {
    const keys = seatIds.map((seatId) => RedisKeys.seat.lock(eventId, seatId),);
    return this.redis.mget(...keys);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async clearByPattern(pattern: string): Promise<void> {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, batch] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      keys.push(...batch);
    } while (cursor !== '0');

    if (keys.length > 0) await this.redis.del(...keys);
  }
}
