import express from 'express';
const router = express.Router();

import monitoringController from '../controllers/monitoring.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { manualCheckLimiter } from '../middleware/rateLimiter.middleware.js';

router.use(protect);

router.get('/history/:projectId', monitoringController.getProjectHistory);
router.post('/check/:projectId', manualCheckLimiter, monitoringController.triggerManualCheck);

export default router;
