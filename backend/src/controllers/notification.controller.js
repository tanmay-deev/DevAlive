import notificationService from '../services/notification.service.js';
import { successResponse } from '../utils/responseHandler.js';

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const result = await notificationService.getNotifications(req.user.id, req.query);
      successResponse(res, 200, 'Notifications retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user.id);
      successResponse(res, 200, 'Notification marked as read', { notification });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      await notificationService.deleteNotification(req.params.id, req.user.id);
      successResponse(res, 200, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
