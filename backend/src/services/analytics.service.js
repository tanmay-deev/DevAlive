import Project from '../models/Project.js';
import MonitoringLog from '../models/MonitoringLog.js';

class AnalyticsService {
  async getDashboardSummary(userId) {
    const projects = await Project.find({ userId });
    
    const totalProjects = projects.length;
    let onlineProjects = 0;
    let offlineProjects = 0;
    let totalUptime = 0;
    let projectsWithUptime = 0;

    projects.forEach(project => {
      if (project.currentStatus === 'online') {
        onlineProjects++;
      } else if (project.currentStatus === 'offline' || project.currentStatus === 'degraded') {
        offlineProjects++;
      }
      
      if (project.totalChecks > 0) {
        totalUptime += project.uptimePercentage;
        projectsWithUptime++;
      }
    });

    const averageUptime = projectsWithUptime > 0 
      ? Number((totalUptime / projectsWithUptime).toFixed(2)) 
      : 100;

    return {
      totalProjects,
      onlineProjects,
      offlineProjects,
      averageUptime
    };
  }

  async getProjectAnalytics(projectId, userId) {
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }

    return {
      uptimePercentage: project.uptimePercentage,
      totalChecks: project.totalChecks,
      successfulChecks: project.successfulChecks,
      failedChecks: project.failedChecks,
      averageResponseTime: project.averageResponseTime
    };
  }

  async getUptimeChartData(projectId, userId, days = 7) {
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await MonitoringLog.find({
      projectId,
      checkedAt: { $gte: startDate }
    })
    .sort({ checkedAt: 1 })
    .select('status responseTime checkedAt');
    
    const chartData = logs.map(log => ({
      timestamp: log.checkedAt,
      responseTime: log.responseTime || 0,
      status: log.status
    }));

    return chartData;
  }
}

export default new AnalyticsService();
