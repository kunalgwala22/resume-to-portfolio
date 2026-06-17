import { Router } from 'express';
import { aiController } from './ai.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authRateLimit } from '../../middleware/rateLimit.middleware';

const router = Router();

router.post('/generate-bio', authMiddleware, aiController.generateBio);
router.post('/recruiter-chat', authRateLimit, aiController.recruiterChat);

export default router;
