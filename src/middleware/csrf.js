import { doubleCsrf } from 'csrf-csrf';
import config from '../config/config.js';

/**
 * CSRF Protection Configuration
 * 
 * This middleware provides CSRF protection for cookie-based authentication.
 * It uses the Double Submit Cookie pattern.
 */
const {
  generateToken, // Generates a CSRF token
  doubleCsrfProtection, // The middleware to apply
} = doubleCsrf({
  getSecret: () => config.session.secret,
  cookieName: '__Host-csrf',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: config.env === 'production',
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

/**
 * Generate CSRF token for a response
 */
export const generateCsrfToken = (req, res) => {
  const token = generateToken(req, res);
  return token;
};

/**
 * CSRF protection middleware
 */
export const csrfProtection = doubleCsrfProtection;

/**
 * Middleware to attach CSRF token to response
 */
export const attachCsrfToken = (req, res, next) => {
  const token = generateToken(req, res);
  res.locals.csrfToken = token;
  next();
};
