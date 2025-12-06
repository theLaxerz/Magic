import rateLimit from 'express-rate-limit';
import config from '../config/config.js';
import logger from '../config/logger.js';

// General rate limiter for all routes
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
    });
  },
});

// Strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again after 15 minutes.',
    });
  },
});

// AI/MCP endpoint rate limiter
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.mcp.rateLimit,
  message: 'Too many AI requests, please slow down.',
  handler: (req, res) => {
    logger.warn(`AI rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many AI requests',
      message: 'Please reduce your request frequency.',
    });
  },
});

// API key rate limiter (for authenticated API users)
export const apiKeyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  keyGenerator: (req) => {
    // Use API key or user ID as key
    return req.user?.id || req.ip;
  },
});
