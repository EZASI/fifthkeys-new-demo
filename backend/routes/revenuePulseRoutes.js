/**
 * RevenuePulse Module - Routes
 * 
 * This file defines the API routes for the RevenuePulse module.
 */

const express = require('express');
const router = express.Router();
const RevenuePulseController = require('../controllers/revenuePulseController');
const authMiddleware = require('../middleware/auth'); // This will be implemented later

// Apply authentication middleware to all routes
// router.use(authMiddleware); // Uncomment when auth is implemented

// Get revenue data
router.get('/revenue-data', RevenuePulseController.getRevenueData);

// Get market data
router.get('/market-data', RevenuePulseController.getMarketData);

// Calculate KPIs
router.get('/kpis', RevenuePulseController.calculateKPIs);

// Predict demand
router.get('/predict-demand', RevenuePulseController.predictDemand);

// Get pricing recommendations
router.get('/recommend-pricing', RevenuePulseController.recommendPricing);

// Run simulation
router.post('/simulation/:hotelId', RevenuePulseController.runSimulation);

// Save revenue data
router.post('/revenue-data', RevenuePulseController.saveRevenueData);

// Save market data
router.post('/market-data', RevenuePulseController.saveMarketData);

module.exports = router;
