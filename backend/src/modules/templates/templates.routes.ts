import { Router } from 'express';
import { templatesController } from './templates.controller';

const router = Router();

router.get('/', templatesController.list);
router.get('/:slug', templatesController.get);

export default router;
