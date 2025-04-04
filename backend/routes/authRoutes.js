/**
 * Authentication Routes
 * 
 * This file defines the API routes for user authentication.
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/update-password', authMiddleware, AuthController.updatePassword);

// Admin-only routes
router.get('/users', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  (req, res) => {
    // This would be implemented in a user management controller
    res.status(200).json({
      success: true,
      message: 'Admin access granted'
    });
  }
);

module.exports = router;
