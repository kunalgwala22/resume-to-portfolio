import { createClient } from 'redis';
import { env } from './env';

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
  // Silent fail during test or fallback
  if (env.NODE_ENV !== 'test') {
    console.error('Redis Client Error', err);
  }
});

redisClient.on('connect', () => {
  if (env.NODE_ENV !== 'test') {
    console.log('Redis Client Connected');
  }
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    if (env.NODE_ENV !== 'test') {
      console.error('Failed to connect to Redis, rate limits will fail closed/fallback to memory.', error);
    }
  }
};

export default redisClient;
