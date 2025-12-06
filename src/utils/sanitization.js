/**
 * Comprehensive input sanitization utilities
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHTML = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    // eslint-disable-next-line no-useless-escape
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
};

/**
 * Sanitize SQL input to prevent SQL injection
 */
export const sanitizeSQL = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove SQL keywords and dangerous characters
  return input
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi, '')
    .replace(/[;'"\\]/g, '');
};

/**
 * Sanitize NoSQL input to prevent NoSQL injection
 */
export const sanitizeNoSQL = (input) => {
  if (typeof input === 'object' && input !== null) {
    // Remove MongoDB operators
    const sanitized = {};
    for (const key in input) {
      if (!key.startsWith('$')) {
        sanitized[key] = sanitizeNoSQL(input[key]);
      }
    }
    return sanitized;
  }
  return input;
};

/**
 * Sanitize file path to prevent directory traversal
 */
export const sanitizePath = (path) => {
  if (typeof path !== 'string') {
    return '';
  }

  // Remove directory traversal patterns
  return path
    .replace(/\.\./g, '')
    // eslint-disable-next-line no-useless-escape
    .replace(/[\/\\]{2,}/g, '/')
    // eslint-disable-next-line no-useless-escape
    .replace(/^[\/\\]/, '');
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidURL = (url) => {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitize filename to prevent malicious names
 */
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') {
    return 'file';
  }

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
};

/**
 * Remove null bytes to prevent null byte injection
 */
export const removeNullBytes = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  return input.replace(/\0/g, '');
};

/**
 * Comprehensive input sanitization
 */
export const sanitizeInput = (input, type = 'general') => {
  if (input === null || input === undefined) {
    return input;
  }

  input = removeNullBytes(input);

  switch (type) {
    case 'html':
      return sanitizeHTML(input);
    case 'sql':
      return sanitizeSQL(input);
    case 'nosql':
      return sanitizeNoSQL(input);
    case 'path':
      return sanitizePath(input);
    case 'filename':
      return sanitizeFilename(input);
    default:
      if (typeof input === 'string') {
        return sanitizeHTML(input);
      }
      return input;
  }
};
