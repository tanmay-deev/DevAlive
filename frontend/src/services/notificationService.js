import apiClient from './apiClient.js';

class NotificationService {
  async getNotifications(page = 1, limit = 20) {
    const response = await apiClient.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  }

  async markAsRead(id) {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async deleteNotification(id) {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  }
}

export default new NotificationService();
