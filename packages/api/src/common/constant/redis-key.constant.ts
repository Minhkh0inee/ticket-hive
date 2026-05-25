export const RedisKeys = {
  auth: {
    refreshToken: (userId: string) => `refresh:${userId}`,
  },

  seat: {
    lock: (eventId: string, seatId: string) => `seat_lock:${eventId}:${seatId}`,
  },

  event: {
    item: (id: string) => `events:item:${id}`,
    seats: (id: string) => `events:item:${id}:seats_locks:`,
    list: (offset: number, limit: number, filters: string) =>
      `events:list:${offset}:${limit}:${filters}`,
    tag: (tag: string) => `events:tag:${tag}`,
    homepage: 'events:homepage',


    patterns: {
      allList: 'events:list:*',
      allTag: 'events:tag:*',
      allItem: 'events:item:*',
    },
  },
} as const;

export const RedisTTL = {
  auth: {
    refreshToken: 60 * 60 * 24 * 7, // 7 ngày
  },
  seat: {
    lock: 600,
  },
  event: {
    item: 3600,     // 1 giờ
    list: 300,      // 5 phút
    tag: 300,       // 5 phút
    homepage: 300,  // 5 phút
  },
} as const;