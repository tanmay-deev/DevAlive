import apiClient from './apiClient.js';

class AnalyticsService {
  async getDashboardSummary() {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  }

  async getProjectAnalytics(projectId) {
    const response = await apiClient.get(`/analytics/project/${projectId}`);
    return response.data;
  }

  async getUptimeChartData(projectId, days = 7) {
    const response = await apiClient.get(`/analytics/uptime-chart/${projectId}?days=${days}`);
    return response.data;
  }
}

export default new AnalyticsService();
