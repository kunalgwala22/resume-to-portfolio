import { Router } from 'express';
import { authController } from './auth.controller';
import { validateBody } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema } from '@portfolioverse/shared';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authRateLimit } from '../../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authRateLimit, validateBody(registerSchema), authController.register);
router.post('/login', authRateLimit, validateBody(loginSchema), authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware, authController.me);

export default router;
