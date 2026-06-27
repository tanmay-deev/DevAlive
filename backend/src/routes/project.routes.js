import express from 'express';
const router = express.Router();

import projectController from '../controllers/project.controller.js';
import validate from '../middleware/validation.middleware.js';
import { createProjectValidator, updateProjectValidator } from '../validators/project.validator.js';
import { protect } from '../middleware/auth.middleware.js';

// All project routes are protected
router.use(protect);

router.route('/')
  .post(createProjectValidator, validate, projectController.createProject)
  .get(projectController.getProjects);

router.route('/:projectId')
  .get(projectController.getProjectById)
  .put(updateProjectValidator, validate, projectController.updateProject)
  .delete(projectController.deleteProject);

router.patch('/:projectId/toggle-monitoring', projectController.toggleMonitoring);

export default router;
