import UserSettings from '../models/UserSettings.js';
import { successResponse } from '../utils/responseHandler.js';

class SettingsController {
  async getSettings(req, res, next) {
    try {
      let settings = await UserSettings.findOne({ userId: req.user.id });
      if (!settings) {
        settings = await UserSettings.create({ userId: req.user.id });
      }
      successResponse(res, 200, 'Settings retrieved successfully', { settings });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const settings = await UserSettings.findOneAndUpdate(
        { userId: req.user.id },
        req.body,
        { new: true, upsert: true }
      );
      successResponse(res, 200, 'Settings updated successfully', { settings });
    } catch (error) {
      next(error);
    }
  }
}

export default new SettingsController();
