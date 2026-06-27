import projectService from '../services/project.service.js';
import { successResponse } from '../utils/responseHandler.js';

class ProjectController {
  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.user.id, req.body);
      successResponse(res, 201, 'Project created successfully', { project });
    } catch (error) {
      next(error);
    }
  }

  async getProjects(req, res, next) {
    try {
      const result = await projectService.getProjects(req.user.id, req.query);
      successResponse(res, 200, 'Projects retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.params.projectId, req.user.id);
      successResponse(res, 200, 'Project retrieved successfully', { project });
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(req.params.projectId, req.user.id, req.body);
      successResponse(res, 200, 'Project updated successfully', { project });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.params.projectId, req.user.id);
      successResponse(res, 200, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleMonitoring(req, res, next) {
    try {
      const project = await projectService.toggleMonitoring(req.params.projectId, req.user.id);
      successResponse(res, 200, `Monitoring ${project.monitoringEnabled ? 'enabled' : 'disabled'} successfully`, { project });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
