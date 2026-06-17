import { Router } from 'express';
import { portfolioController } from './portfolio.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { portfolioUpdateSchema } from '@portfolioverse/shared';
import { trackPortfolioView } from '../../middleware/analytics.middleware';

const router = Router();

// Authenticated portfolio controls
router.get('/', authMiddleware, portfolioController.get);
router.put('/', authMiddleware, validateBody(portfolioUpdateSchema), portfolioController.update);
router.post('/publish', authMiddleware, portfolioController.publish);

// Public portfolio access (with analytics logging middleware)
router.get('/public/:username', trackPortfolioView, portfolioController.getPublic);

export default router;
