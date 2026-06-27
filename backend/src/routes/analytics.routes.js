import express from 'express';
const router = express.Router();

import analyticsController from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.use(protect);

router.get('/dashboard', analyticsController.getDashboardSummary);
router.get('/project/:projectId', analyticsController.getProjectAnalytics);
router.get('/uptime-chart/:projectId', analyticsController.getUptimeChartData);

export default router;
