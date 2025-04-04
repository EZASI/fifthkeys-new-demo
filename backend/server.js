/**
 * Security Integration for Server
 * 
 * This file integrates security middleware with the Express server.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const { applySecurityMiddleware } = require('./middleware/security');
const securityConfig = require('./config/security');

// Import routes
const authRoutes = require('./routes/authRoutes');
const revenuePulseRoutes = require('./routes/revenuePulseRoutes');
const guestDNARoutes = require('./routes/guestDNARoutes');
const hotelTwinRoutes = require('./routes/hotelTwinRoutes');

// Create Express app
const app = express();

// Apply basic middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply session middleware
app.use(session({
  secret: securityConfig.session.secret,
  name: securityConfig.session.name,
  resave: securityConfig.session.resave,
  saveUninitialized: securityConfig.session.saveUninitialized,
  cookie: securityConfig.session.cookie,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/fifthkeys',
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Apply security middleware
applySecurityMiddleware(app);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/revenue-pulse', revenuePulseRoutes);
app.use('/api/guest-dna', guestDNARoutes);
app.use('/api/hotel-twin', hotelTwinRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Log error
  if (securityConfig.auditLogging.enabled) {
    const logAuditEvent = require('./middleware/security').logAuditEvent;
    logAuditEvent(req, 'error', 'failure', {
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Export app
module.exports = app;
