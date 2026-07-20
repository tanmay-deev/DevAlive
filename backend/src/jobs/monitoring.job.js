import cron from 'node-cron';
import Project from '../models/Project.js';
import monitoringService from '../services/monitoring.service.js';
import pLimit from 'p-limit';

const startMonitoring = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running monitoring cron job...`);
    try {
      const now = new Date();
      
      // Fetch all projects where monitoring is enabled
      const projects = await Project.find({ monitoringEnabled: true });
      
      // Limit concurrency to 50 concurrent requests to prevent event loop exhaustion
      const limit = pLimit(50);
      const checkPromises = [];

      for (const project of projects) {
        let shouldCheck = true;
        
        if (project.lastCheckedAt) {
          const timeSinceLastCheckMs = now.getTime() - new Date(project.lastCheckedAt).getTime();
          // interval is stored in minutes
          const intervalMs = project.monitoringInterval * 60 * 1000;
          
          if (timeSinceLastCheckMs < intervalMs) {
            shouldCheck = false;
          }
        }
        
        if (shouldCheck) {
          console.log(`[Monitoring] Queueing project check: ${project.projectName} (${project.endpointUrl})`);
          // Add to promises array with concurrency limit
          checkPromises.push(limit(() => 
            monitoringService.executeHealthCheck(project).catch(err => {
              console.error(`[Monitoring] Failed to execute health check for ${project.projectName}:`, err.message);
            })
          ));
        }
      }

      // Wait for all queued checks to finish before cron completes this cycle
      await Promise.allSettled(checkPromises);
      
    } catch (error) {
      console.error('[Monitoring] Error in monitoring job:', error);
    }
  });
};

export default startMonitoring;
