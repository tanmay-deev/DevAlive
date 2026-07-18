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

  async updateResetToken(id, token, expireDate) {
    return await User.findByIdAndUpdate(id, { 
      resetPasswordToken: token, 
      resetPasswordExpire: expireDate 
    });
  }

  async findByResetToken(token) {
    return await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });
  }

  async updatePassword(id, hashedPassword) {
    return await User.findByIdAndUpdate(id, {
      password: hashedPassword,
      $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 }
    });
  }

  async findByVerificationToken(token) {
    return await User.findOne({ emailVerificationToken: token });
  }

  async verifyUserEmail(id) {
    return await User.findByIdAndUpdate(id, {
      $set: { emailVerified: true },
      $unset: { emailVerificationToken: 1 }
    }, { new: true });
  }
}

export default new UserRepository();
