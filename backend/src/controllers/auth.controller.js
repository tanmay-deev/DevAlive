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

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      successResponse(res, 200, 'Password reset email sent (if account exists)');
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await authService.resetPassword(token, password);
      successResponse(res, 200, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      await authService.verifyEmail(token);
      successResponse(res, 200, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { user } = await authService.updateProfile(req.user.id, req.body);
      successResponse(res, 200, 'Profile updated successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      await authService.deleteAccount(req.user.id);
      successResponse(res, 200, 'Account deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
