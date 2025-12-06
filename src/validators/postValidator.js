import { body } from 'express-validator';

/**
 * Validation rules for creating a post
 */
export const createPostValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Tags can only contain letters, numbers, hyphens, and underscores'),
];

/**
 * Validation rules for updating a post
 */
export const updatePostValidation = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  body('content')
    .optional()
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Tags can only contain letters, numbers, hyphens, and underscores'),
];

/**
 * Validation rules for comments
 */
export const commentValidation = [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isString()
    .withMessage('Comment must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
    .trim(),
];
