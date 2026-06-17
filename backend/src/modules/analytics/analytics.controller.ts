import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';
import { getIpLocation } from '../../lib/geoip';

export class AnalyticsController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const stats = await analyticsService.getOverview(userId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  async getViews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const views = await analyticsService.getTimeSeries(userId, days);
      
      res.status(200).json({
        success: true,
        data: { views }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const countries = await analyticsService.getCountries(userId);
      
      res.status(200).json({
        success: true,
        data: { countries }
      });
    } catch (error) {
      next(error);
    }
  }

  async getDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const devices = await analyticsService.getDevices(userId);
      
      res.status(200).json({
        success: true,
        data: { devices }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const projects = await analyticsService.getTopProjects(userId);
      
      res.status(200).json({
        success: true,
        data: { projects }
      });
    } catch (error) {
      next(error);
    }
  }

  async trackView(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.body;
      if (!username) {
        res.status(400).json({
          success: false,
          message: 'Username is required to log a view',
          error: { code: 'USERNAME_REQUIRED' }
        });
        return;
      }

      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
                 req.ip || 
                 req.socket.remoteAddress || 
                 '127.0.0.1';

      const userAgent = req.headers['user-agent'] || '';
      const referer = req.headers['referer'] || req.headers['referrer'] || '';

      let device = 'desktop';
      if (/mobile/i.test(userAgent)) device = 'mobile';
      else if (/tablet|ipad/i.test(userAgent)) device = 'tablet';

      let browser = 'Other';
      if (/chrome|crios/i.test(userAgent) && !/edge|edg/i.test(userAgent)) browser = 'Chrome';
      else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent) && !/edge|edg/i.test(userAgent)) browser = 'Safari';
      else if (/firefox/i.test(userAgent)) browser = 'Firefox';

      const location = await getIpLocation(ip);

      await analyticsService.trackView(username, {
        ip,
        country: location.country || 'Unknown',
        city: location.city || 'Unknown',
        device,
        browser,
        referer: referer ? referer.toString() : undefined
      });

      res.status(200).json({
        success: true,
        message: 'Portfolio view recorded successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
export default analyticsController;
