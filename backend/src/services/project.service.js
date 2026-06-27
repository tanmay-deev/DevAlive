import projectRepository from '../repositories/project.repository.js';

class ProjectService {
  async createProject(userId, data) {
    const projectData = {
      ...data,
      userId,
    };
    return await projectRepository.create(projectData);
  }

  async getProjects(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filters
    const filters = {};
    if (query.status) {
      filters.currentStatus = query.status;
    }
    if (query.search) {
      filters.projectName = { $regex: query.search, $options: 'i' };
    }

    const { projects, totalRecords } = await projectRepository.findAll(userId, filters, skip, limit);
    
    const totalPages = Math.ceil(totalRecords / limit);
    
    return {
      projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  async getProjectById(projectId, userId) {
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }
    return project;
  }

  async updateProject(projectId, userId, updateData) {
    const project = await projectRepository.update(projectId, userId, updateData);
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }
    return project;
  }

  async deleteProject(projectId, userId) {
    const project = await projectRepository.delete(projectId, userId);
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }
    // Note: We might also want to delete associated monitoring logs later
    return project;
  }

  async toggleMonitoring(projectId, userId) {
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
      throw { status: 404, message: 'Project not found' };
    }

    project.monitoringEnabled = !project.monitoringEnabled;
    await project.save();
    return project;
  }
}

export default new ProjectService();
