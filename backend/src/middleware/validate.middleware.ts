import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Request payload validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.format()
          }
        });
        return;
      }
      next(error);
    }
  };
};

export default {
  validateBody
};
