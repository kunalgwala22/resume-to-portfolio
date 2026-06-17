import { Request, Response, NextFunction } from 'express';
import { resumeService } from './resume.service';

export class ResumeController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
          error: { code: 'FILE_REQUIRED' }
        });
        return;
      }

      const resume = await resumeService.uploadAndParseResume(
        userId,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.status(202).json({
        success: true,
        message: 'Resume uploaded and processing started in the background.',
        data: { resume }
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const resumes = await resumeService.listResumes(userId);
      
      res.status(200).json({
        success: true,
        data: { resumes }
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      const resume = await resumeService.getResume(userId, id);
      
      res.status(200).json({
        success: true,
        data: { resume }
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      await resumeService.deleteResume(userId, id);
      
      res.status(200).json({
        success: true,
        message: 'Resume deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      const resume = await resumeService.activateResume(userId, id);
      
      res.status(200).json({
        success: true,
        message: 'Resume activated successfully',
        data: { resume }
      });
    } catch (error) {
      next(error);
    }
  }

  async getSections(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      const resume = await resumeService.getResume(userId, id);
      
      res.status(200).json({
        success: true,
        data: {
          skills: resume.skills,
          experiences: resume.experiences,
          educations: resume.educations,
          projects: resume.projects,
          certifications: resume.certifications,
          socialLinks: resume.socialLinks
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSections(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const { id } = req.params;
      const resume = await resumeService.updateResumeSections(userId, id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Resume sections updated successfully',
        data: { resume }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const resumeController = new ResumeController();
export default resumeController;
