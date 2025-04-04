/**
 * Security Middleware
 * 
 * This file contains security middleware for the FifthKeys platform.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { v4: uuidv4 } = require('uuid');
const securityConfig = require('../config/security');
const { User, AuditLog } = require('../../database/schema');

/**
 * Apply security middleware to Express app
 * @param {Object} app - Express app
 */
const applySecurityMiddleware = (app) => {
  // Apply Helmet security headers
  app.use(helmet(securityConfig.helmet));
  
  // Apply CORS
  app.use(cors(securityConfig.cors));
  
  // Apply rate limiting
  const limiter = rateLimit(securityConfig.rateLimit);
  app.use('/api/', limiter);
  
  // Apply stricter rate limiting for authentication routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  
  // Apply data sanitization against NoSQL query injection
  app.use(mongoSanitize());
  
  // Apply data sanitization against XSS
  app.use(xss());
  
  // Prevent parameter pollution
  app.use(hpp());
  
  // Add security headers
  app.use((req, res, next) => {
    // Content Security Policy
    if (securityConfig.csp.enabled !== false) {
      res.setHeader('Content-Security-Policy', buildCspHeader(securityConfig.csp.directives));
    }
    
    // XSS Protection
    if (securityConfig.xss.enabled) {
      res.setHeader('X-XSS-Protection', securityConfig.xss.mode ? `1; mode=${securityConfig.xss.mode}` : '1');
    }
    
    next();
  });
  
  // Add request ID for tracing
  app.use((req, res, next) => {
    req.id = uuidv4();
    res.setHeader('X-Request-ID', req.id);
    next();
  });
  
  console.log('Security middleware applied');
};

/**
 * Build Content Security Policy header
 * @param {Object} directives - CSP directives
 * @returns {string} - CSP header value
 */
const buildCspHeader = (directives) => {
  return Object.entries(directives)
    .map(([key, value]) => {
      if (value.length === 0) {
        return key;
      }
      return `${key} ${value.join(' ')}`;
    })
    .join('; ');
};

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, securityConfig.jwt.secret, {
      algorithms: [securityConfig.jwt.algorithm],
      issuer: securityConfig.jwt.issuer
    });
    
    // Find user by ID
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }
    
    // Add user to request object
    req.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      hotelId: user.hotelId
    };
    
    // Log authentication
    if (securityConfig.auditLogging.enabled) {
      await logAuditEvent(req, 'authentication', 'success', {
        userId: user._id.toString(),
        email: user.email
      });
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Log authentication failure
    if (securityConfig.auditLogging.enabled) {
      await logAuditEvent(req, 'authentication', 'failure', {
        error: error.message
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} - Express middleware function
 */
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      // Log authorization failure
      if (securityConfig.auditLogging.enabled) {
        logAuditEvent(req, 'authorization', 'failure', {
          userId: req.user.id,
          requiredRoles: roles,
          userRole: req.user.role
        });
      }
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    // Log authorization success
    if (securityConfig.auditLogging.enabled) {
      logAuditEvent(req, 'authorization', 'success', {
        userId: req.user.id,
        role: req.user.role
      });
    }
    
    next();
  };
};

/**
 * Log audit event
 * @param {Object} req - Express request object
 * @param {string} eventType - Event type
 * @param {string} outcome - Event outcome
 * @param {Object} details - Event details
 */
const logAuditEvent = async (req, eventType, outcome, details) => {
  try {
    // Filter out sensitive fields
    const filteredDetails = { ...details };
    securityConfig.auditLogging.sensitiveFields.forEach(field => {
      if (filteredDetails[field]) {
        filteredDetails[field] = '[REDACTED]';
      }
    });
    
    // Create audit log entry
    const auditLog = new AuditLog({
      timestamp: new Date(),
      requestId: req.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user ? req.user.id : null,
      eventType,
      outcome,
      resourceType: req.originalUrl.split('/')[2], // Extract resource type from URL
      resourceId: req.params.id,
      method: req.method,
      path: req.originalUrl,
      details: filteredDetails
    });
    
    await auditLog.save();
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
};

/**
 * Validate password against policy
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
const validatePassword = (password) => {
  const policy = securityConfig.passwordPolicy;
  const errors = [];
  
  // Check minimum length
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }
  
  // Check for uppercase letters
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for lowercase letters
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for numbers
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for special characters
  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Hash password
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Password to compare
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} - Comparison result
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    securityConfig.jwt.secret,
    {
      expiresIn: securityConfig.jwt.expiresIn,
      algorithm: securityConfig.jwt.algorithm,
      issuer: securityConfig.jwt.issuer
    }
  );
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    securityConfig.jwt.secret,
    {
      expiresIn: securityConfig.jwt.refreshExpiresIn,
      algorithm: securityConfig.jwt.algorithm,
      issuer: securityConfig.jwt.issuer
    }
  );
};

module.exports = {
  applySecurityMiddleware,
  authMiddleware,
  roleMiddleware,
  validatePassword,
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  logAuditEvent
};
