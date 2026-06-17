import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { env } from '../../config/env';

const isProduction = env.NODE_ENV === 'production';

const getRefreshTokenFromRequest = (req: Request): string | null => {
  if (req.body?.refreshToken) {
    return req.body.refreshToken;
  }
  
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, curr) => {
    const [key, value] = curr.split('=').map(c => c.trim());
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
  
  return cookies['refreshToken'] || null;
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict'
  });
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      setRefreshTokenCookie(res, result.refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = getRefreshTokenFromRequest(req);
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token is missing',
          error: { code: 'REFRESH_TOKEN_REQUIRED' }
        });
        return;
      }

      const result = await authService.refresh(refreshToken);
      setRefreshTokenCookie(res, result.refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Tokens rotated successfully',
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (userId) {
        await authService.logout(userId);
      }
      clearRefreshTokenCookie(res);
      
      res.status(200).json({
        success: true,
        message: 'User logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized access',
          error: { code: 'UNAUTHORIZED' }
        });
        return;
      }
      
      const user = await authService.getProfile(userId);
      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
export default authController;
