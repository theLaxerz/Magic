import { MongoClient } from 'mongodb';
import config from './config.js';
import logger from './logger.js';

let client = null;
let db = null;

export async function connectDB() {
  try {
    // Build connection string with authentication if provided
    let uri = config.mongodb.uri;
    if (config.mongodb.user && config.mongodb.password) {
      // Properly encode credentials
      const username = encodeURIComponent(config.mongodb.user);
      const password = encodeURIComponent(config.mongodb.password);
      uri = uri.replace('mongodb://', `mongodb://${username}:${password}@`);
    }

    client = new MongoClient(uri, {
      // Security options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Enable TLS/SSL in production
      tls: config.env === 'production',
      tlsAllowInvalidCertificates: false,
      // Connection pooling
      maxPoolSize: 10,
      minPoolSize: 2,
      // Timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db();

    logger.info('MongoDB connected successfully');

    // Test the connection
    await db.admin().ping();
    logger.info('MongoDB ping successful');

    return db;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    logger.info('MongoDB connection closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});
