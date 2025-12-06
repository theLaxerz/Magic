import { body } from 'express-validator';

/**
 * Validation rules for AI prompt
 */
export const aiPromptValidation = [
  body('prompt')
    .notEmpty()
    .withMessage('Prompt is required')
    .isString()
    .withMessage('Prompt must be a string')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Prompt must be between 1 and 10000 characters')
    .trim(),
  body('maxTokens')
    .optional()
    .isInt({ min: 1, max: 4000 })
    .withMessage('maxTokens must be between 1 and 4000'),
  body('temperature')
    .optional()
    .isFloat({ min: 0, max: 2 })
    .withMessage('temperature must be between 0 and 2'),
];

/**
 * Validation rules for MCP tool execution
 */
export const mcpToolValidation = [
  body('toolName')
    .notEmpty()
    .withMessage('Tool name is required')
    .isString()
    .withMessage('Tool name must be a string')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Tool name can only contain letters, numbers, underscores, and hyphens'),
  body('parameters')
    .optional()
    .isObject()
    .withMessage('Parameters must be an object'),
];

/**
 * Validation rules for AI conversation
 */
export const aiConversationValidation = [
  body('messages')
    .isArray({ min: 1 })
    .withMessage('Messages must be a non-empty array'),
  body('messages.*.role')
    .isIn(['user', 'assistant', 'system'])
    .withMessage('Message role must be user, assistant, or system'),
  body('messages.*.content')
    .notEmpty()
    .withMessage('Message content is required')
    .isString()
    .withMessage('Message content must be a string')
    .isLength({ max: 5000 })
    .withMessage('Message content must not exceed 5000 characters'),
];
