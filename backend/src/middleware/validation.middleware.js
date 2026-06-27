import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseHandler.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 422, 'Validation Error', errors.array().map(err => err.msg));
  }
  next();
};

export default validate;
