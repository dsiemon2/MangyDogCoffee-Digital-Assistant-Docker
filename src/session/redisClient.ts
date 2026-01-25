import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!_redis && process.env.REDIS_URL) {
    try {
      _redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true
      });
      _redis.on('error', () => {
        // Silently ignore Redis errors for local dev
      });
    } catch {
      return null;
    }
  }
  return _redis;
}

// For BullMQ workers - create connection immediately if REDIS_URL is set
function createRedisConnection(): Redis | { host: string; port: number } {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null, // BullMQ requires this
      enableReadyCheck: false
    });
  }
  // Fallback to localhost for local dev (will fail gracefully)
  return { host: 'localhost', port: 6379 };
}

// Export for BullMQ - needs to be a real Redis instance or connection options
export const redis = createRedisConnection();
