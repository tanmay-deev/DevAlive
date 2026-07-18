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
    const maxRetries = 2; // Total of 3 attempts
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
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
          errorMessage = '';
          break; // Exit loop on success
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

      // If failed and retries left, wait using exponential backoff
      if (status !== 'success' && attempt < maxRetries) {
        const backoffDelay = Math.pow(2, attempt) * 2000; // 2s, 4s delay
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
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
    
    // Check if status changed
    if (project.currentStatus !== newStatus) {
      if (!isSuccess && (project.currentStatus === 'online' || project.currentStatus === 'unknown')) {
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
