import MonitoringLog from '../models/MonitoringLog.js';
import Project from '../models/Project.js';
import { successResponse } from '../utils/responseHandler.js';
import monitoringService from '../services/monitoring.service.js';

class MonitoringController {
  async getProjectHistory(req, res, next) {
    try {
      const { projectId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Verify ownership
      const project = await Project.findOne({ _id: projectId, userId: req.user.id });
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const logs = await MonitoringLog.find({ projectId })
        .sort({ checkedAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalRecords = await MonitoringLog.countDocuments({ projectId });
      const totalPages = Math.ceil(totalRecords / limit);

      successResponse(res, 200, 'Monitoring history retrieved successfully', {
        logs,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async triggerManualCheck(req, res, next) {
    try {
      const { projectId } = req.params;
      
      const project = await Project.findOne({ _id: projectId, userId: req.user.id });
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const log = await monitoringService.executeHealthCheck(project);
      
      successResponse(res, 200, 'Manual health check executed successfully', { log });
    } catch (error) {
      next(error);
    }
  }
}

export default new MonitoringController();
