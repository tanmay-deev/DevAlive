import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository.js';
import generateToken from '../utils/generateToken.js';

class AuthService {
  async register(userData) {
    const { fullName, email, password } = userData;

    // Check if user exists
    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw { status: 409, message: 'User already exists with this email' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Email Verification Token
    const crypto = await import('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Create user
    const user = await userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedVerificationToken
    });

    const token = generateToken(user._id);

    // Send Verification Email (non-blocking)
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    try {
      const emailService = (await import('./email.service.js')).default;
      emailService.sendVerificationEmail(user.email, verifyUrl).catch(err => {
        console.error('Failed to send verification email during registration:', err);
      });
    } catch (error) {
      console.error('Could not load email service:', error);
    }

    // Convert to object and remove password
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async login(email, password) {
    // Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    // Update last login
    await userRepository.updateLastLogin(user._id);

    const token = generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return { user };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { success: true };
    }

    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    await userRepository.updateResetToken(user._id, resetPasswordToken, resetPasswordExpire);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    try {
      const emailService = (await import('./email.service.js')).default;
      await emailService.sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
      await userRepository.updateResetToken(user._id, undefined, undefined);
      throw { status: 500, message: 'Email could not be sent' };
    }
    
    return { success: true };
  }

  async resetPassword(token, newPassword) {
    const crypto = await import('crypto');
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await userRepository.findByResetToken(resetPasswordToken);
    if (!user) {
      throw { status: 400, message: 'Invalid or expired reset token' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userRepository.updatePassword(user._id, hashedPassword);
    
    return { success: true };
  }

  async verifyEmail(token) {
    const crypto = await import('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await userRepository.findByVerificationToken(hashedToken);
    if (!user) {
      throw { status: 400, message: 'Invalid or expired verification token' };
    }

    await userRepository.verifyUserEmail(user._id);
    return { success: true };
  }

  async updateProfile(userId, updateData) {
    const { fullName, email, currentPassword, newPassword } = updateData;
    const user = await userRepository.findById(userId).select('+password');
    
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    if (email && email !== user.email) {
      const emailExists = await userRepository.findByEmail(email);
      if (emailExists) {
        throw { status: 409, message: 'Email already in use' };
      }
      user.email = email;
      user.emailVerified = false; // Require re-verification
      
      const crypto = await import('crypto');
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

      const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
      try {
        const emailService = (await import('./email.service.js')).default;
        emailService.sendVerificationEmail(user.email, verifyUrl).catch(err => {
          console.error('Failed to send verification email during profile update:', err);
        });
      } catch (error) {
        console.error('Could not load email service:', error);
      }
    }

    if (fullName) {
      user.fullName = fullName;
    }

    if (newPassword) {
      if (!currentPassword) {
        throw { status: 400, message: 'Current password is required to set a new password' };
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw { status: 401, message: 'Invalid current password' };
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;
    
    return { user: userObj };
  }

  async deleteAccount(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // Cascade delete related records
    const mongoose = (await import('mongoose')).default;
    const Project = mongoose.model('Project');
    const MonitoringLog = mongoose.model('MonitoringLog');
    const Notification = mongoose.model('Notification');
    const Settings = mongoose.model('Settings');
    const User = mongoose.model('User');

    // Get all project IDs to delete their logs if logs are tied to projects
    // Wait, MonitoringLog is tied to projectId. 
    // We can delete all projects, then all logs for those projects, but it's easier to just delete by userId if we add userId to logs. 
    // Currently, MonitoringLog might not have userId. Let's fetch projects and delete logs by projectId.
    const projects = await Project.find({ userId });
    const projectIds = projects.map(p => p._id);

    await MonitoringLog.deleteMany({ projectId: { $in: projectIds } });
    await Project.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    if (Settings) {
      await Settings.deleteMany({ userId });
    }
    
    await User.findByIdAndDelete(userId);
    
    return { success: true };
  }
}

export default new AuthService();
