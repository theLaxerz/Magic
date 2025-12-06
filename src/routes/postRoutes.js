import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { 
  createPostValidation, 
  updatePostValidation, 
  commentValidation 
} from '../validators/postValidator.js';
import { objectIdValidation, paginationValidation } from '../validators/userValidator.js';
import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * GET /api/posts
 * Get all posts with pagination
 */
router.get(
  '/',
  paginationValidation,
  validate,
  catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const db = getDB();
    const postsCollection = db.collection('posts');

    const posts = await postsCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await postsCollection.countDocuments({});

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

/**
 * GET /api/posts/:id
 * Get a single post by ID
 */
router.get(
  '/:id',
  objectIdValidation,
  validate,
  catchAsync(async (req, res) => {
    const db = getDB();
    const postsCollection = db.collection('posts');

    const post = await postsCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!post) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  })
);

/**
 * POST /api/posts
 * Create a new post
 */
router.post(
  '/',
  authenticate,
  createPostValidation,
  validate,
  catchAsync(async (req, res) => {
    const { title, content, tags } = req.body;

    const db = getDB();
    const postsCollection = db.collection('posts');

    const newPost = {
      title,
      content,
      tags: tags || [],
      author: {
        id: req.user.id,
        username: req.user.username,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      comments: [],
    };

    const result = await postsCollection.insertOne(newPost);

    logger.info(`Post created by user ${req.user.id}: ${result.insertedId}`);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        id: result.insertedId,
        ...newPost,
      },
    });
  })
);

/**
 * PUT /api/posts/:id
 * Update a post
 */
router.put(
  '/:id',
  authenticate,
  objectIdValidation,
  updatePostValidation,
  validate,
  catchAsync(async (req, res) => {
    const { title, content, tags } = req.body;

    const db = getDB();
    const postsCollection = db.collection('posts');

    // Check if post exists and user is the author
    const post = await postsCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!post) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    if (post.author.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this post',
      });
    }

    // Update post
    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(tags && { tags }),
      updatedAt: new Date(),
    };

    await postsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    logger.info(`Post updated by user ${req.user.id}: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Post updated successfully',
    });
  })
);

/**
 * DELETE /api/posts/:id
 * Delete a post
 */
router.delete(
  '/:id',
  authenticate,
  objectIdValidation,
  validate,
  catchAsync(async (req, res) => {
    const db = getDB();
    const postsCollection = db.collection('posts');

    // Check if post exists and user is the author
    const post = await postsCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (!post) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    if (post.author.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this post',
      });
    }

    await postsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    logger.info(`Post deleted by user ${req.user.id}: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  })
);

/**
 * POST /api/posts/:id/comments
 * Add a comment to a post
 */
router.post(
  '/:id/comments',
  authenticate,
  objectIdValidation,
  commentValidation,
  validate,
  catchAsync(async (req, res) => {
    const { content } = req.body;

    const db = getDB();
    const postsCollection = db.collection('posts');

    const comment = {
      id: new ObjectId().toString(),
      content,
      author: {
        id: req.user.id,
        username: req.user.username,
      },
      createdAt: new Date(),
    };

    const result = await postsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { comments: comment } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    logger.info(`Comment added by user ${req.user.id} to post ${req.params.id}`);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  })
);

export default router;
