/**
 * HotelTwin Module - Routes
 * 
 * This file defines the API routes for the HotelTwin module.
 */

const express = require('express');
const router = express.Router();
const HotelTwinController = require('../controllers/hotelTwinController');
const authMiddleware = require('../middleware/auth'); // This will be implemented later

// Apply authentication middleware to all routes
// router.use(authMiddleware); // Uncomment when auth is implemented

// Get digital twin model for a specific hotel
router.get('/hotels/:hotelId/digital-twin', HotelTwinController.getDigitalTwin);

// Create or update a digital twin model
router.post('/digital-twins', HotelTwinController.saveDigitalTwin);

// Get all spaces in a hotel's digital twin
router.get('/hotels/:hotelId/spaces', HotelTwinController.getSpaces);

// Add or update a space in the digital twin
router.post('/hotels/:hotelId/spaces', HotelTwinController.updateSpace);

// Get all assets in a hotel's digital twin
router.get('/hotels/:hotelId/assets', HotelTwinController.getAssets);

// Add or update an asset in the digital twin
router.post('/hotels/:hotelId/assets', HotelTwinController.updateAsset);

// Get sensor data for a specific hotel
router.get('/hotels/:hotelId/sensor-data', HotelTwinController.getSensorData);

// Save new sensor data
router.post('/sensor-data', HotelTwinController.saveSensorData);

// Analyze space utilization
router.get('/hotels/:hotelId/analyze/space-utilization', HotelTwinController.analyzeSpaceUtilization);

// Analyze energy usage
router.get('/hotels/:hotelId/analyze/energy-usage', HotelTwinController.analyzeEnergyUsage);

// Run a simulation for space optimization
router.post('/hotels/:hotelId/simulate/space-optimization', HotelTwinController.runSpaceOptimizationSimulation);

module.exports = router;
