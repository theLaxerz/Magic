import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validator.js';
import { 
  registerValidation, 
  loginValidation, 
  updatePasswordValidation
} from '../validators/userValidator.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/security.js';
import { generateToken } from '../middleware/auth.js';
import { getDB } from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  authLimiter,
  registerValidation,
  validate,
  catchAsync(async (req, res) => {
    const { email, password, username } = req.body;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password does not meet security requirements',
        details: passwordValidation.errors,
      });
    }

    const db = getDB();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      logger.warn(`Registration attempt with existing email/username: ${email}`);
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email or username already exists.',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = {
      email,
      username,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Generate token
    const token = generateToken({
      id: result.insertedId.toString(),
      email,
      username,
      role: 'user',
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: result.insertedId.toString(),
        email,
        username,
        role: 'user',
      },
      token,
    });
  })
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const db = getDB();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ email });

    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect.',
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for user: ${email}`);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect.',
      });
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role || 'user',
    });

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role || 'user',
      },
      token,
    });
  })
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get(
  '/me',
  authenticate,
  catchAsync(async (req, res) => {
    const db = getDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne(
      { _id: req.user.id },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found.',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  })
);

/**
 * PUT /api/auth/password
 * Update user password
 */
router.put(
  '/password',
  authenticate,
  updatePasswordValidation,
  validate,
  catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const db = getDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found.',
      });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
        message: 'Current password is incorrect.',
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    logger.info(`Password updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  })
);

export default router;
