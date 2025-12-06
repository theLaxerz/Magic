import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { aiPromptValidation, mcpToolValidation } from '../validators/aiValidator.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { 
  sanitizePrompt, 
  validateAIInput, 
  filterAIResponse, 
  logAIInteraction 
} from '../utils/aiSecurity.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * POST /api/ai/prompt
 * Submit a prompt to the AI
 */
router.post(
  '/prompt',
  authenticate,
  aiLimiter,
  aiPromptValidation,
  validate,
  catchAsync(async (req, res) => {
    const { prompt, maxTokens, temperature } = req.body;

    // Validate input for safety
    const validation = validateAIInput(prompt);
    if (!validation.isValid) {
      logger.warn(`Invalid AI input from user ${req.user.id}: ${validation.errors}`);
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Your input contains invalid or suspicious content.',
        details: validation.errors,
      });
    }

    // Sanitize the prompt
    const sanitizedPrompt = sanitizePrompt(prompt);

    // In a real implementation, you would call your AI service here
    // For this example, we'll return a mock response
    const mockResponse = `This is a secure AI response to: ${sanitizedPrompt.substring(0, 50)}...`;

    // Filter response for sensitive content
    const filteredResponse = filterAIResponse(mockResponse);

    // Log the interaction
    logAIInteraction(req.user.id, sanitizedPrompt, filteredResponse, {
      maxTokens,
      temperature,
    });

    res.json({
      success: true,
      response: filteredResponse,
      metadata: {
        promptLength: sanitizedPrompt.length,
        responseLength: filteredResponse.length,
        maxTokens,
        temperature,
      },
    });
  })
);

/**
 * POST /api/ai/mcp/execute
 * Execute an MCP tool
 */
router.post(
  '/mcp/execute',
  authenticate,
  aiLimiter,
  mcpToolValidation,
  validate,
  catchAsync(async (req, res) => {
    const { toolName, parameters } = req.body;

    // Validate tool name
    const allowedTools = ['search', 'summarize', 'translate', 'analyze'];
    if (!allowedTools.includes(toolName)) {
      return res.status(400).json({
        error: 'Invalid tool',
        message: `Tool '${toolName}' is not available. Allowed tools: ${allowedTools.join(', ')}`,
      });
    }

    // Log MCP execution
    logger.info(`MCP tool execution: ${toolName} by user ${req.user.id}`);

    // In a real implementation, you would execute the MCP tool here
    // For this example, we'll return a mock response
    const mockResult = {
      tool: toolName,
      result: `Executed ${toolName} successfully`,
      parameters,
    };

    res.json({
      success: true,
      data: mockResult,
    });
  })
);

/**
 * GET /api/ai/usage
 * Get AI usage statistics for the current user
 */
router.get(
  '/usage',
  authenticate,
  catchAsync(async (req, res) => {
    // In a real implementation, you would fetch usage data from the database
    const mockUsage = {
      userId: req.user.id,
      totalRequests: 42,
      tokensUsed: 15000,
      lastRequest: new Date().toISOString(),
      remainingQuota: 85000,
    };

    res.json({
      success: true,
      data: mockUsage,
    });
  })
);

export default router;
