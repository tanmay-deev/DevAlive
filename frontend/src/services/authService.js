import apiClient from './apiClient.js';

class AuthService {
  async register(name, email, password) {
    const response = await apiClient.post('/auth/register', { fullName: name, email, password });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  }

  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  }

  async getMe() {
    const response = await apiClient.get('/auth/me');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch user');
  }

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }
}

export default new AuthService();
