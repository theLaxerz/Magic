import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/magic_secure',
    user: process.env.MONGODB_USER || '',
    password: process.env.MONGODB_PASSWORD || '',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10),
  },

  // Security
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // AI/MCP
  mcp: {
    apiKey: process.env.MCP_API_KEY || '',
    rateLimit: parseInt(process.env.MCP_RATE_LIMIT || '10', 10),
  },

  ai: {
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000', 10),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
  },
};

// Validate critical configuration
if (config.env === 'production') {
  if (config.jwt.secret === 'default-secret-change-in-production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  if (config.session.secret === 'default-session-secret-change-in-production') {
    throw new Error('SESSION_SECRET must be set in production');
  }
}

export default config;
