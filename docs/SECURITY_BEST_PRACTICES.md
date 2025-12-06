# Magic Secure App - Security Best Practices Guide

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [API Security](#api-security)
4. [Database Security](#database-security)
5. [AI/MCP Security](#aimcp-security)
6. [Configuration Security](#configuration-security)
7. [Deployment Security](#deployment-security)

## Authentication & Authorization

### JWT Implementation
```javascript
// Secure JWT configuration
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '7d',
  issuer: 'magic-secure-app',
  audience: 'magic-users',
});
```

**Best Practices:**
- Use strong, randomly generated JWT secrets (min 32 characters)
- Set appropriate expiration times
- Never store JWT secrets in code
- Implement token refresh mechanisms for long-lived sessions
- Use httpOnly cookies for token storage in browsers

### Password Security
```javascript
// Password hashing with bcrypt
const hashedPassword = await bcrypt.hash(password, 12);

// Password validation
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Use bcrypt with minimum 12 rounds

## Input Validation & Sanitization

### Express Validator Usage
```javascript
const validation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail(),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape(),
];
```

### XSS Prevention
```javascript
import xss from 'xss-clean';
app.use(xss());

// Manual sanitization
const sanitizeHTML = (input) => {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
};
```

### NoSQL Injection Prevention
```javascript
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());

// Manual sanitization
const sanitizeNoSQL = (input) => {
  if (typeof input === 'object') {
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
```

## AI/MCP Security

### Prompt Injection Prevention
```javascript
export const sanitizePrompt = (prompt) => {
  return prompt
    .replace(/system:|assistant:|user:/gi, '')
    .replace(/\[INST\]|\[\/INST\]/g, '')
    .replace(/<\|.*?\|>/g, '')
    .trim();
};
```

### Input Validation for AI
```javascript
export const validateAIInput = (input) => {
  const suspiciousPatterns = [
    /ignore previous instructions/i,
    /disregard all previous/i,
    /forget everything/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, errors: ['Suspicious pattern detected'] };
    }
  }

  return { isValid: true, errors: [] };
};
```

For complete documentation, see the full guide in the repository.
