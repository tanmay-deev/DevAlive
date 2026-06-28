import apiClient from './apiClient.js';

class ProjectService {
  async getAllProjects() {
    const response = await apiClient.get('/projects');
    return response.data;
  }

  async getProject(id) {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(projectData) {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  }

  async updateProject(id, projectData) {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
  }

  async deleteProject(id) {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  }

  async toggleMonitoring(id) {
    const response = await apiClient.patch(`/projects/${id}/toggle-monitoring`);
    return response.data;
  }
}

export default new ProjectService();
