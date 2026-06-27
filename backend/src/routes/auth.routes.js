import express from 'express';
const router = express.Router();

import authController from '../controllers/auth.controller.js';
import validate from '../middleware/validation.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);

export default router;
