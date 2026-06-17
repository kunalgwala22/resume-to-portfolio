import { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service';

export class AIController {
  async generateBio(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId!;
      const bio = await aiService.generateBio(userId);
      
      res.status(200).json({
        success: true,
        message: 'Bio description generated successfully',
        data: { bio }
      });
    } catch (error) {
      next(error);
    }
  }

  async recruiterChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, messages } = req.body;

      if (!username || !messages || !Array.isArray(messages)) {
        res.status(400).json({
          success: false,
          message: 'Username and messages list are required',
          error: { code: 'INVALID_CHAT_PAYLOAD' }
        });
        return;
      }

      const reply = await aiService.chatWithRecruiter(username, messages);
      
      res.status(200).json({
        success: true,
        data: { reply }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
export default aiController;
