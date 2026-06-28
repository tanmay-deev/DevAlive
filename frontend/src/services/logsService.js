import apiClient from './apiClient.js';

class LogsService {
  async getMonitoringLogs(projectId, page = 1, limit = 50) {
    const response = await apiClient.get(`/monitoring/history/${projectId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async triggerManualCheck(projectId) {
    const response = await apiClient.post(`/monitoring/check/${projectId}`);
    return response.data;
  }
}

export default new LogsService();
