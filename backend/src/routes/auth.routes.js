import express from 'express';
const router = express.Router();

import authController from '../controllers/auth.controller.js';
import validate from '../middleware/validation.middleware.js';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';

router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/google', authLimiter, authController.googleLogin);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidator, validate, authController.resetPassword);
router.get('/verify-email/:token', authLimiter, authController.verifyEmail);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.delete('/me', protect, authController.deleteAccount);
router.post('/logout', protect, authController.logout);

export default router;
