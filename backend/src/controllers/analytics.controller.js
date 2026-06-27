import analyticsService from '../services/analytics.service.js';
import { successResponse } from '../utils/responseHandler.js';

class AnalyticsController {
  async getDashboardSummary(req, res, next) {
    try {
      const summary = await analyticsService.getDashboardSummary(req.user.id);
      successResponse(res, 200, 'Dashboard summary retrieved successfully', summary);
    } catch (error) {
      next(error);
    }
  }

  async getProjectAnalytics(req, res, next) {
    try {
      const analytics = await analyticsService.getProjectAnalytics(req.params.projectId, req.user.id);
      successResponse(res, 200, 'Project analytics retrieved successfully', analytics);
    } catch (error) {
      next(error);
    }
  }

  async getUptimeChartData(req, res, next) {
    try {
      const days = req.query.days ? parseInt(req.query.days) : 7;
      const chartData = await analyticsService.getUptimeChartData(req.params.projectId, req.user.id, days);
      successResponse(res, 200, 'Chart data retrieved successfully', { chartData });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();
