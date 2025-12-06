import { validationResult } from 'express-validator';
import logger from '../config/logger.js';

/**
 * Middleware to handle validation errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove potential XSS vectors
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  }
  return input;
};

/**
 * Sanitize all request body fields
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};
