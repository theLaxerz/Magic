import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import logger from '../config/logger.js';

/**
 * Middleware to verify JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You are not logged in. Please log in to access this resource.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Your authentication token is invalid.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your authentication token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Unable to authenticate. Please try again.',
    });
  }
};

/**
 * Middleware to check user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource.',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource.',
      });
    }

    next();
  };
};

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'magic-secure-app',
    audience: 'magic-users',
  });
};

/**
 * Verify JWT token (utility function)
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
