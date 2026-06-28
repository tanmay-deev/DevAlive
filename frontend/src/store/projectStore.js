import { create } from 'zustand';
import projectService from '../services/projectService.js';

const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.getAllProjects();
      set({ projects: data.data.projects, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch projects', isLoading: false });
    }
  },

  addProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.createProject(projectData);
      set(state => ({ projects: [...state.projects, data.data.project], isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add project', isLoading: false });
      return false;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(id);
      set(state => ({ projects: state.projects.filter(p => p._id !== id), isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete project', isLoading: false });
      return false;
    }
  },

  editProject: async (id, projectData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectService.updateProject(id, projectData);
      set(state => ({
        projects: state.projects.map(p => p._id === id ? data.data.project : p),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update project', isLoading: false });
      return false;
    }
  },

  toggleMonitoring: async (id) => {
    set({ error: null });
    try {
      const data = await projectService.toggleMonitoring(id);
      set(state => ({
        projects: state.projects.map(p => p._id === id ? data.data.project : p)
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to toggle monitoring' });
      return false;
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useProjectStore;
