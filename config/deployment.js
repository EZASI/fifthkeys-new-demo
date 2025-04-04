/**
 * Deployment Configuration for FifthKeys Platform
 * 
 * This file contains the deployment configuration for the FifthKeys platform.
 */

// Import required modules
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Deployment configuration
const deploymentConfig = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'production'
  },
  
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fifthkeys',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true
    }
  },
  
  // Frontend configuration
  frontend: {
    buildDir: path.join(__dirname, 'frontend/build'),
    assetsDir: path.join(__dirname, 'frontend/build/assets')
  },
  
  // API configuration
  api: {
    baseUrl: process.env.API_BASE_URL || '/api',
    version: 'v1'
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    dir: path.join(__dirname, 'logs')
  },
  
  // SSL configuration
  ssl: {
    enabled: process.env.SSL_ENABLED === 'true',
    key: process.env.SSL_KEY_PATH,
    cert: process.env.SSL_CERT_PATH
  },
  
  // Monitoring configuration
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    interval: parseInt(process.env.MONITORING_INTERVAL || '60000', 10)
  }
};

module.exports = deploymentConfig;
