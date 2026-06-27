import Project from '../models/Project.js';

class ProjectRepository {
  async create(projectData) {
    return await Project.create(projectData);
  }

  async findById(projectId, userId) {
    return await Project.findOne({ _id: projectId, userId });
  }

  async findAll(userId, filters = {}, skip = 0, limit = 10) {
    const query = { userId, ...filters };
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalRecords = await Project.countDocuments(query);
    
    return { projects, totalRecords };
  }

  async update(projectId, userId, updateData) {
    return await Project.findOneAndUpdate(
      { _id: projectId, userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async delete(projectId, userId) {
    return await Project.findOneAndDelete({ _id: projectId, userId });
  }
}

export default new ProjectRepository();
