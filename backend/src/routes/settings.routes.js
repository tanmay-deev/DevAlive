import express from 'express';
const router = express.Router();

import settingsController from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.use(protect);

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

export default router;
