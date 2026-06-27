import express from 'express';
const router = express.Router();

import notificationController from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.use(protect);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
