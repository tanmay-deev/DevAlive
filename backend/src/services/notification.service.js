import Notification from '../models/Notification.js';
import UserSettings from '../models/UserSettings.js';
import User from '../models/User.js';
import emailService from './email.service.js';

class NotificationService {
  async triggerAlert(project, type) {
    try {
      const user = await User.findById(project.userId);
      let settings = await UserSettings.findOne({ userId: project.userId });
      
      // Ensure user has settings
      if (!settings) {
         settings = await UserSettings.create({ userId: project.userId });
      }

      let title = '';
      let message = '';

      if (type === 'downtime') {
        title = 'Project Offline';
        message = `Your project ${project.projectName} went offline.`;
      } else if (type === 'recovery') {
        title = 'Project Recovered';
        message = `Your project ${project.projectName} is back online.`;
      }

      // 1. Create in-app notification
      await Notification.create({
        userId: project.userId,
        projectId: project._id,
        notificationType: type === 'downtime' ? 'downtime_alert' : 'recovery_alert',
        title,
        message
      });

      // 2. Send email if enabled in settings
      if (settings.emailNotifications) {
        const timeStr = new Date().toLocaleString();
        const alertEmail = settings.notificationEmail || user.email;
        
        if (type === 'downtime' && settings.downtimeAlerts) {
          await emailService.sendDowntimeAlert(alertEmail, project.projectName, project.endpointUrl, timeStr);
        } else if (type === 'recovery' && settings.recoveryAlerts) {
          await emailService.sendRecoveryAlert(alertEmail, project.projectName, project.endpointUrl, timeStr);
        }
      }
    } catch (error) {
      console.error('[NotificationService] Failed to trigger alert:', error);
    }
  }

  async getNotifications(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await Notification.countDocuments({ userId });
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      notifications,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  async deleteNotification(notificationId, userId) {
    return await Notification.findOneAndDelete({ _id: notificationId, userId });
  }
}

export default new NotificationService();
