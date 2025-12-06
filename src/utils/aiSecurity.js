import logger from '../config/logger.js';

/**
 * Sanitize AI prompt input to prevent prompt injection
 */
export const sanitizePrompt = (prompt) => {
  if (typeof prompt !== 'string') {
    return '';
  }

  // Remove potential prompt injection patterns
  let sanitized = prompt
    .replace(/system:|assistant:|user:/gi, '') // Remove role indicators
    .replace(/\[INST\]|\[\/INST\]/g, '') // Remove instruction markers
    .replace(/<\|.*?\|>/g, '') // Remove special tokens
    .trim();

  // Limit length to prevent abuse
  const maxLength = 2000;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Validate AI input for safety
 */
export const validateAIInput = (input) => {
  const errors = [];

  if (!input || typeof input !== 'string') {
    errors.push('Input must be a non-empty string');
    return { isValid: false, errors };
  }

  // Check for minimum length
  if (input.trim().length < 1) {
    errors.push('Input cannot be empty');
  }

  // Check for maximum length
  if (input.length > 10000) {
    errors.push('Input is too long (max 10000 characters)');
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /ignore previous instructions/i,
    /disregard all previous/i,
    /forget everything/i,
    /you are now/i,
    /new instructions:/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      logger.warn(`Suspicious AI input detected: ${input.substring(0, 100)}`);
      errors.push('Input contains suspicious patterns');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Filter AI response for sensitive content
 */
export const filterAIResponse = (response) => {
  if (typeof response !== 'string') {
    return '';
  }

  // Remove potential sensitive patterns
  let filtered = response
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED-SSN]') // SSN
    .replace(/\b\d{16}\b/g, '[REDACTED-CARD]') // Credit card
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED-EMAIL]'); // Email

  return filtered;
};

/**
 * Rate limit check for AI requests per user
 */
export const checkAIRateLimit = (userId, requests = {}) => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!requests[userId]) {
    requests[userId] = [];
  }

  // Remove old requests outside the window
  requests[userId] = requests[userId].filter(
    timestamp => now - timestamp < windowMs
  );

  // Check if limit exceeded
  if (requests[userId].length >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((requests[userId][0] + windowMs - now) / 1000),
    };
  }

  // Add current request
  requests[userId].push(now);

  return { allowed: true };
};

/**
 * Log AI interaction for audit
 */
export const logAIInteraction = (userId, prompt, response, metadata = {}) => {
  logger.info('AI Interaction', {
    userId,
    promptLength: prompt.length,
    responseLength: response.length,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};
