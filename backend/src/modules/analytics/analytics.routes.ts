import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Private dashboard endpoints
router.get('/overview', authMiddleware, analyticsController.getOverview);
router.get('/views', authMiddleware, analyticsController.getViews);
router.get('/countries', authMiddleware, analyticsController.getCountries);
router.get('/devices', authMiddleware, analyticsController.getDevices);
router.get('/top-projects', authMiddleware, analyticsController.getTopProjects);

// Public tracking endpoint
router.post('/view', analyticsController.trackView);

export default router;
