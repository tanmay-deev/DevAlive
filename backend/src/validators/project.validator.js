import { body } from 'express-validator';

export const createProjectValidator = [
  body('projectName')
    .notEmpty()
    .withMessage('Project name is required')
    .isString(),
  body('endpointUrl')
    .notEmpty()
    .withMessage('Endpoint URL is required')
    .isURL({ require_protocol: true })
    .withMessage('Please provide a valid URL with protocol (e.g., https://)'),
  body('projectType')
    .optional()
    .isIn(['website', 'api', 'backend', 'health-endpoint'])
    .withMessage('Invalid project type'),
  body('monitoringInterval')
    .optional()
    .isIn([1, 5, 10, 15, 30, 60, 300, 720, 1440, 7200])
    .withMessage('Invalid interval value'),
];

export const updateProjectValidator = [
  body('projectName').optional().isString().notEmpty(),
  body('endpointUrl').optional().isURL({ require_protocol: true }),
  body('projectType').optional().isIn(['website', 'api', 'backend', 'health-endpoint']),
  body('monitoringInterval').optional().isIn([1, 5, 10, 15, 30, 60, 300, 720, 1440, 7200]),
];
