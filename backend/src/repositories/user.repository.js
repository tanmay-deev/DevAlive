import User from '../models/User.js';

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return await User.findById(id);
  }

  async updateLastLogin(id) {
    return await User.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true });
  }
}

export default new UserRepository();
