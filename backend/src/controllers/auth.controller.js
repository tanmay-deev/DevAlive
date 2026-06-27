import authService from '../services/auth.service.js';
import { successResponse } from '../utils/responseHandler.js';

class AuthController {
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      successResponse(res, 201, 'Account created successfully', { user, token });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      successResponse(res, 200, 'Login successful', { user, token });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const { user } = await authService.getMe(req.user.id);
      successResponse(res, 200, 'User profile fetched successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // In a stateless JWT setup, logout is usually handled client-side by destroying the token.
      // But for completeness in the API:
      successResponse(res, 200, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
