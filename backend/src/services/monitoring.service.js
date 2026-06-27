import MonitoringLog from '../models/MonitoringLog.js';
import Project from '../models/Project.js';
import notificationService from './notification.service.js';

class MonitoringService {
  async executeHealthCheck(project) {
    const startTime = Date.now();
    let status = 'error';
    let httpStatusCode = null;
    let errorMessage = '';
    let responseTime = 0;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(project.endpointUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      httpStatusCode = response.status;
      if (response.ok) {
        status = 'success';
      } else {
        status = 'failure';
        errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        status = 'timeout';
        errorMessage = 'Request timed out after 10000ms';
      } else {
        status = 'error';
        errorMessage = error.message;
      }
    }

    responseTime = Date.now() - startTime;

    const log = await MonitoringLog.create({
      userId: project.userId,
      projectId: project._id,
      status,
      httpStatusCode,
      responseTime,
      errorMessage,
      checkedAt: new Date()
    });

    await this.updateProjectStatistics(project, log);

    return log;
  }

  async updateProjectStatistics(project, log) {
    const isSuccess = log.status === 'success';
    
    const newStatus = isSuccess ? 'online' : (log.status === 'timeout' ? 'degraded' : 'offline');
    
    // Check if status changed from online to offline, or offline to online
    if (project.currentStatus !== 'unknown' && project.currentStatus !== newStatus) {
      if (!isSuccess && project.currentStatus === 'online') {
        await notificationService.triggerAlert(project, 'downtime');
      } else if (isSuccess && (project.currentStatus === 'offline' || project.currentStatus === 'degraded')) {
        await notificationService.triggerAlert(project, 'recovery');
      }
    }

    const updates = {
      lastCheckedAt: log.checkedAt,
      currentStatus: newStatus,
      totalChecks: project.totalChecks + 1,
      successfulChecks: isSuccess ? project.successfulChecks + 1 : project.successfulChecks,
      failedChecks: isSuccess ? project.failedChecks : project.failedChecks + 1,
    };

    if (isSuccess) {
      updates.lastSuccessAt = log.checkedAt;
    } else {
      updates.lastFailureAt = log.checkedAt;
    }

    // Calculate Uptime %
    updates.uptimePercentage = (updates.successfulChecks / updates.totalChecks) * 100;

    // Calculate Average Response Time (rolling average)
    if (log.responseTime && isSuccess) {
      const currentTotalResponseTime = (project.averageResponseTime || 0) * project.successfulChecks;
      updates.averageResponseTime = (currentTotalResponseTime + log.responseTime) / updates.successfulChecks;
    }

    await Project.findByIdAndUpdate(project._id, updates);
  }
}

export default new MonitoringService();
