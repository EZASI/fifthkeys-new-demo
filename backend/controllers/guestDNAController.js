/**
 * GuestDNA Module - Controller
 * 
 * This file contains the controller functions for the GuestDNA module.
 * These controllers handle HTTP requests and responses for the GuestDNA API.
 */

const GuestDNAModel = require('../models/guestDNA');

class GuestDNAController {
  /**
   * Get guest profile by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getGuestProfile(req, res) {
    try {
      const { guestId } = req.params;
      
      if (!guestId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: guestId' 
        });
      }
      
      const guestProfile = await GuestDNAModel.getGuestProfile(guestId);
      
      if (!guestProfile) {
        return res.status(404).json({
          success: false,
          message: 'Guest profile not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: guestProfile
      });
    } catch (error) {
      console.error('Error in getGuestProfile controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Search for guests by various criteria
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async searchGuests(req, res) {
    try {
      const { hotelId } = req.params;
      const criteria = req.query;
      
      if (!hotelId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: hotelId' 
        });
      }
      
      const guests = await GuestDNAModel.searchGuests(criteria, hotelId);
      
      return res.status(200).json({
        success: true,
        count: guests.length,
        data: guests
      });
    } catch (error) {
      console.error('Error in searchGuests controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Create or update a guest profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async saveGuestProfile(req, res) {
    try {
      const guestData = req.body;
      
      if (!guestData || !guestData.hotelId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields in guest data' 
        });
      }
      
      const savedProfile = await GuestDNAModel.saveGuestProfile(guestData);
      
      return res.status(201).json({
        success: true,
        message: 'Guest profile saved successfully',
        data: savedProfile
      });
    } catch (error) {
      console.error('Error in saveGuestProfile controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Add a stay to guest history
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async addStayToHistory(req, res) {
    try {
      const { guestId } = req.params;
      const stayData = req.body;
      
      if (!guestId || !stayData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: guestId and stay data' 
        });
      }
      
      const updatedProfile = await GuestDNAModel.addStayToHistory(guestId, stayData);
      
      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Guest profile not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Stay added to history successfully',
        data: updatedProfile
      });
    } catch (error) {
      console.error('Error in addStayToHistory controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Update guest spending profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateSpendingProfile(req, res) {
    try {
      const { guestId } = req.params;
      const spendingData = req.body;
      
      if (!guestId || !spendingData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: guestId and spending data' 
        });
      }
      
      const updatedProfile = await GuestDNAModel.updateSpendingProfile(guestId, spendingData);
      
      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Guest profile not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Spending profile updated successfully',
        data: updatedProfile
      });
    } catch (error) {
      console.error('Error in updateSpendingProfile controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Add behavior tags to guest profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async addBehaviorTags(req, res) {
    try {
      const { guestId } = req.params;
      const { tags } = req.body;
      
      if (!guestId || !tags || !Array.isArray(tags)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: guestId and tags array' 
        });
      }
      
      const updatedProfile = await GuestDNAModel.addBehaviorTags(guestId, tags);
      
      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Guest profile not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Behavior tags added successfully',
        data: updatedProfile
      });
    } catch (error) {
      console.error('Error in addBehaviorTags controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Record AI interaction with guest
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async recordInteraction(req, res) {
    try {
      const interactionData = req.body;
      
      if (!interactionData || !interactionData.hotelId || !interactionData.sessionId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields in interaction data' 
        });
      }
      
      const savedInteraction = await GuestDNAModel.recordInteraction(interactionData);
      
      return res.status(201).json({
        success: true,
        message: 'Interaction recorded successfully',
        data: savedInteraction
      });
    } catch (error) {
      console.error('Error in recordInteraction controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get AI interactions for a specific guest
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getGuestInteractions(req, res) {
    try {
      const { guestId } = req.params;
      const { limit } = req.query;
      
      if (!guestId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: guestId' 
        });
      }
      
      const interactions = await GuestDNAModel.getGuestInteractions(
        guestId, 
        limit ? parseInt(limit) : 50
      );
      
      return res.status(200).json({
        success: true,
        count: interactions.length,
        data: interactions
      });
    } catch (error) {
      console.error('Error in getGuestInteractions controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Analyze guest sentiment from interactions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async analyzeGuestSentiment(req, res) {
    try {
      const { guestId } = req.params;
      
      if (!guestId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: guestId' 
        });
      }
      
      const sentimentAnalysis = await GuestDNAModel.analyzeGuestSentiment(guestId);
      
      return res.status(200).json({
        success: true,
        data: sentimentAnalysis
      });
    } catch (error) {
      console.error('Error in analyzeGuestSentiment controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Generate personalized recommendations for a guest
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async generateRecommendations(req, res) {
    try {
      const { guestId } = req.params;
      
      if (!guestId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: guestId' 
        });
      }
      
      const recommendations = await GuestDNAModel.generateRecommendations(guestId);
      
      return res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Error in generateRecommendations controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Process natural language query from guest
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async processNaturalLanguageQuery(req, res) {
    try {
      const { guestId, hotelId } = req.params;
      const { query } = req.body;
      
      if (!guestId || !hotelId || !query) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: guestId, hotelId, and query' 
        });
      }
      
      const response = await GuestDNAModel.processNaturalLanguageQuery(guestId, query, hotelId);
      
      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in processNaturalLanguageQuery controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = GuestDNAController;
