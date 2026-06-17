import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import { env } from '../config/env';

export const rateLimiter = (limit: number, windowMs: number, keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Bypass for test environments
    if (env.NODE_ENV === 'test') {
      next();
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const redisKey = `ratelimit:${keyPrefix}:${ip}`;

    try {
      if (!redisClient.isOpen) {
        // Fallback closed (allow) if redis is not connected
        next();
        return;
      }

      const requests = await redisClient.incr(redisKey);
      if (requests === 1) {
        await redisClient.expire(redisKey, Math.ceil(windowMs / 1000));
      }

      if (requests > limit) {
        res.status(429).json({
          success: false,
          message: 'Too many requests. Please slow down and try again later.',
          error: { code: 'TOO_MANY_REQUESTS' }
        });
        return;
      }
      
      next();
    } catch (error) {
      // Fail open: let requests pass if Redis goes down in production
      next();
    }
  };
};

export const globalRateLimit = rateLimiter(env.RATE_LIMIT_MAX, env.RATE_LIMIT_WINDOW_MS, 'global');
export const authRateLimit = rateLimiter(env.AUTH_RATE_LIMIT_MAX, env.RATE_LIMIT_WINDOW_MS, 'auth');

export default {
  globalRateLimit,
  authRateLimit,
  rateLimiter
};
