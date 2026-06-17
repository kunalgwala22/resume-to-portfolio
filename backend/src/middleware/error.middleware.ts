import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (env.NODE_ENV !== 'test') {
    console.error('💥 Server Error Handler:', err);
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

export default errorMiddleware;
