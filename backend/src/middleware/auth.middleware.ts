import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      success: false, 
      message: 'Authorization token required',
      error: { code: 'UNAUTHORIZED' }
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired access token',
      error: { code: 'TOKEN_EXPIRED', details: error.message }
    });
  }
};

export default authMiddleware;
