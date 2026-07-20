import MonitoringLog from '../models/MonitoringLog.js';
import Project from '../models/Project.js';
import notificationService from './notification.service.js';
import dns from 'dns';
import { promisify } from 'util';
import ipaddr from 'ipaddr.js';

const resolveDns = promisify(dns.lookup);

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
        const parsedUrl = new URL(project.endpointUrl);
        const hostname = parsedUrl.hostname;
        
        // Prevent SSRF by resolving DNS and checking if IP is private/internal
        const { address } = await resolveDns(hostname);
        const ip = ipaddr.parse(address);
        
        if (ip.range() !== 'unicast') { // Blocks loopback, private, multicast, etc.
           throw new Error(`SSRF Blocked: IP address ${address} is not a public IP.`);
        }

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
    
    const updates = {
      lastCheckedAt: log.checkedAt,
      currentStatus: newStatus,
      totalChecks: project.totalChecks + 1,
      successfulChecks: isSuccess ? project.successfulChecks + 1 : project.successfulChecks,
      failedChecks: isSuccess ? project.failedChecks : project.failedChecks + 1,
      consecutiveFailures: isSuccess ? 0 : (project.consecutiveFailures || 0) + 1
    };

    if (isSuccess) {
      updates.lastSuccessAt = log.checkedAt;
    } else {
      updates.lastFailureAt = log.checkedAt;
    }

    // Check if status changed or alert threshold reached
    if (project.currentStatus !== newStatus || (!isSuccess && updates.consecutiveFailures === 2)) {
      if (!isSuccess && updates.consecutiveFailures === 2 && (project.currentStatus === 'online' || project.currentStatus === 'unknown')) {
        await notificationService.triggerAlert(project, 'downtime');
      } else if (isSuccess && (project.currentStatus === 'offline' || project.currentStatus === 'degraded')) {
        await notificationService.triggerAlert(project, 'recovery');
      }
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
