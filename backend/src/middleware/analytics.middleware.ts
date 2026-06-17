import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { getIpLocation } from '../lib/geoip';

export const trackPortfolioView = async (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers['referer'] || req.headers['referrer'] || '';
  
  // Resolve client IP (consider proxy headers)
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
             req.ip || 
             req.socket.remoteAddress || 
             '127.0.0.1';

  // Parse device type from User-Agent
  let device = 'desktop';
  if (/mobile/i.test(userAgent)) {
    device = 'mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    device = 'tablet';
  }

  // Parse browser name from User-Agent
  let browser = 'Other';
  if (/chrome|crios/i.test(userAgent) && !/edge|edg/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent) && !/edge|edg/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/firefox|iceweasel/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/edge|edg/i.test(userAgent)) {
    browser = 'Edge';
  }

  const { username } = req.params;

  if (username) {
    // Run asynchronously to avoid blocking the HTTP response
    (async () => {
      try {
        const portfolio = await prisma.portfolio.findFirst({
          where: {
            user: { 
              username,
              deletedAt: null
            },
            deletedAt: null
          },
          select: { id: true, userId: true }
        });

        if (portfolio) {
          const location = await getIpLocation(ip);
          
          await prisma.portfolioView.create({
            data: {
              userId: portfolio.userId,
              portfolioId: portfolio.id,
              ip,
              country: location.country,
              city: location.city,
              device,
              browser,
              referer: referer ? referer.toString() : null
            }
          });
        }
      } catch (error) {
        console.error('Failed to record portfolio view analytics:', error);
      }
    })();
  }

  next();
};

export default trackPortfolioView;
