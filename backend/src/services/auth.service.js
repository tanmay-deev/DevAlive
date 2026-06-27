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

    // Create user
    const user = await userRepository.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

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
}

export default new AuthService();
