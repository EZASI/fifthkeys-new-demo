/**
 * GuestDNA Module - Routes
 * 
 * This file defines the API routes for the GuestDNA module.
 */

const express = require('express');
const router = express.Router();
const GuestDNAController = require('../controllers/guestDNAController');
const authMiddleware = require('../middleware/auth'); // This will be implemented later

// Apply authentication middleware to all routes
// router.use(authMiddleware); // Uncomment when auth is implemented

// Get guest profile by ID
router.get('/guests/:guestId', GuestDNAController.getGuestProfile);

// Search for guests
router.get('/hotels/:hotelId/guests', GuestDNAController.searchGuests);

// Create or update a guest profile
router.post('/guests', GuestDNAController.saveGuestProfile);

// Add a stay to guest history
router.post('/guests/:guestId/stays', GuestDNAController.addStayToHistory);

// Update guest spending profile
router.put('/guests/:guestId/spending', GuestDNAController.updateSpendingProfile);

// Add behavior tags to guest profile
router.post('/guests/:guestId/tags', GuestDNAController.addBehaviorTags);

// Record AI interaction with guest
router.post('/interactions', GuestDNAController.recordInteraction);

// Get AI interactions for a specific guest
router.get('/guests/:guestId/interactions', GuestDNAController.getGuestInteractions);

// Analyze guest sentiment from interactions
router.get('/guests/:guestId/sentiment', GuestDNAController.analyzeGuestSentiment);

// Generate personalized recommendations for a guest
router.get('/guests/:guestId/recommendations', GuestDNAController.generateRecommendations);

// Process natural language query from guest
router.post('/hotels/:hotelId/guests/:guestId/query', GuestDNAController.processNaturalLanguageQuery);

module.exports = router;
