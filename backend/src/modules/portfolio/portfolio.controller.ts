import { Request, Response, NextFunction } from 'express';
import { portfolioService } from './portfolio.service';
import { verifyAccessToken } from '../../lib/jwt';

export class PortfolioController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const portfolio = await portfolioService.getPortfolio(userId);
      
      res.status(200).json({
        success: true,
        data: { portfolio }
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const portfolio = await portfolioService.updatePortfolio(userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Portfolio updated successfully',
        data: { portfolio }
      });
    } catch (error) {
      next(error);
    }
  }

  async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const { isPublished } = req.body;

      if (typeof isPublished !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isPublished status is required',
          error: { code: 'PUBLISH_STATUS_REQUIRED' }
        });
        return;
      }

      const portfolio = await portfolioService.publishToggle(userId, isPublished);
      
      res.status(200).json({
        success: true,
        message: `Portfolio ${isPublished ? 'published' : 'unpublished'} successfully`,
        data: { portfolio }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      
      // Optionally extract token if present to check draft ownership
      let requesterUserId: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = verifyAccessToken(token);
          requesterUserId = decoded.userId;
        } catch (err) {
          // Token invalid or expired: treat as anonymous
        }
      }

      const portfolioData = await portfolioService.getPublicPortfolio(username, requesterUserId);
      
      res.status(200).json({
        success: true,
        data: { portfolio: portfolioData }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();
export default portfolioController;
