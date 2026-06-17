import { Router } from 'express';
import { resumeController } from './resume.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { uploadMiddleware } from '../../middleware/upload.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { updateResumeSectionsSchema } from '@portfolioverse/shared';

const router = Router();

// Apply auth middleware to all resume paths
router.use(authMiddleware);

router.post('/upload', uploadMiddleware, resumeController.upload);
router.get('/', resumeController.list);
router.get('/:id', resumeController.get);
router.delete('/:id', resumeController.delete);
router.post('/:id/activate', resumeController.activate);
router.get('/:id/sections', resumeController.getSections);
router.put('/:id/sections', validateBody(updateResumeSectionsSchema), resumeController.updateSections);

export default router;
