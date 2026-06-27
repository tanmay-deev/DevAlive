import cron from 'node-cron';
import Project from '../models/Project.js';
import monitoringService from '../services/monitoring.service.js';

const startMonitoring = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running monitoring cron job...`);
    try {
      const now = new Date();
      
      // Fetch all projects where monitoring is enabled
      const projects = await Project.find({ monitoringEnabled: true });
      
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
          console.log(`[Monitoring] Checking project: ${project.projectName} (${project.endpointUrl})`);
          // Execute asynchronously without awaiting here to parallelize requests
          monitoringService.executeHealthCheck(project).catch(err => {
            console.error(`[Monitoring] Failed to execute health check for ${project.projectName}:`, err.message);
          });
        }
      }
    } catch (error) {
      console.error('[Monitoring] Error in monitoring job:', error);
    }
  });
};

export default startMonitoring;
