import { Request, Response, NextFunction } from 'express';
import { templatesService } from './templates.service';

export class TemplatesController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await templatesService.listTemplates();
      res.status(200).json({
        success: true,
        data: { templates }
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const template = await templatesService.getTemplateBySlug(slug);
      
      res.status(200).json({
        success: true,
        data: { template }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const templatesController = new TemplatesController();
export default templatesController;
