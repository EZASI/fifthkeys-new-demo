/**
 * GuestDNA Module - Models
 * 
 * This file contains the business logic models for the GuestDNA module.
 * These models interact with the database schemas and implement the core functionality.
 */

const mongoose = require('mongoose');
const { Guest, AIInteraction, Hotel } = require('../../database/schema');

class GuestDNAModel {
  /**
   * Get guest profile by ID
   * @param {string} guestId - The guest ID
   * @returns {Promise<Object>} - Guest profile object
   */
  static async getGuestProfile(guestId) {
    try {
      return await Guest.findById(guestId);
    } catch (error) {
      console.error('Error fetching guest profile:', error);
      throw error;
    }
  }

  /**
   * Search for guests by various criteria
   * @param {Object} criteria - Search criteria
   * @param {string} hotelId - The hotel ID
   * @returns {Promise<Array>} - Array of matching guest profiles
   */
  static async searchGuests(criteria, hotelId) {
    try {
      const query = { hotelId: mongoose.Types.ObjectId(hotelId) };
      
      // Add search criteria to query
      if (criteria.name) {
        const nameRegex = new RegExp(criteria.name, 'i');
        query.$or = [
          { firstName: nameRegex },
          { lastName: nameRegex }
        ];
      }
      
      if (criteria.email) {
        query.email = new RegExp(criteria.email, 'i');
      }
      
      if (criteria.loyaltyTier) {
        query.loyaltyTier = criteria.loyaltyTier;
      }
      
      if (criteria.nationality) {
        query.nationality = new RegExp(criteria.nationality, 'i');
      }
      
      if (criteria.tags && criteria.tags.length > 0) {
        query.behaviorTags = { $in: criteria.tags };
      }
      
      // Pagination
      const limit = criteria.limit || 20;
      const skip = criteria.page ? (criteria.page - 1) * limit : 0;
      
      return await Guest.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error searching guests:', error);
      throw error;
    }
  }

  /**
   * Create or update a guest profile
   * @param {Object} guestData - Guest profile data
   * @returns {Promise<Object>} - Updated guest profile
   */
  static async saveGuestProfile(guestData) {
    try {
      if (guestData._id) {
        // Update existing guest
        const guestId = guestData._id;
        delete guestData._id; // Remove _id to avoid MongoDB error
        
        guestData.updatedAt = new Date();
        
        return await Guest.findByIdAndUpdate(
          guestId,
          { $set: guestData },
          { new: true, runValidators: true }
        );
      } else {
        // Create new guest
        const newGuest = new Guest(guestData);
        return await newGuest.save();
      }
    } catch (error) {
      console.error('Error saving guest profile:', error);
      throw error;
    }
  }

  /**
   * Add a stay to guest history
   * @param {string} guestId - The guest ID
   * @param {Object} stayData - Stay data
   * @returns {Promise<Object>} - Updated guest profile
   */
  static async addStayToHistory(guestId, stayData) {
    try {
      return await Guest.findByIdAndUpdate(
        guestId,
        { 
          $push: { stayHistory: stayData },
          $set: { updatedAt: new Date() }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error adding stay to history:', error);
      throw error;
    }
  }

  /**
   * Update guest spending profile
   * @param {string} guestId - The guest ID
   * @param {Object} spendingData - Spending data
   * @returns {Promise<Object>} - Updated guest profile
   */
  static async updateSpendingProfile(guestId, spendingData) {
    try {
      return await Guest.findByIdAndUpdate(
        guestId,
        { 
          $set: { 
            spendingProfile: spendingData,
            updatedAt: new Date()
          }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating spending profile:', error);
      throw error;
    }
  }

  /**
   * Add behavior tags to guest profile
   * @param {string} guestId - The guest ID
   * @param {Array} tags - Array of behavior tags
   * @returns {Promise<Object>} - Updated guest profile
   */
  static async addBehaviorTags(guestId, tags) {
    try {
      return await Guest.findByIdAndUpdate(
        guestId,
        { 
          $addToSet: { behaviorTags: { $each: tags } },
          $set: { updatedAt: new Date() }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error adding behavior tags:', error);
      throw error;
    }
  }

  /**
   * Record AI interaction with guest
   * @param {Object} interactionData - Interaction data
   * @returns {Promise<Object>} - Saved interaction
   */
  static async recordInteraction(interactionData) {
    try {
      const newInteraction = new AIInteraction(interactionData);
      return await newInteraction.save();
    } catch (error) {
      console.error('Error recording interaction:', error);
      throw error;
    }
  }

  /**
   * Get AI interactions for a specific guest
   * @param {string} guestId - The guest ID
   * @param {number} limit - Maximum number of interactions to return
   * @returns {Promise<Array>} - Array of interactions
   */
  static async getGuestInteractions(guestId, limit = 50) {
    try {
      return await AIInteraction.find({ guestId: mongoose.Types.ObjectId(guestId) })
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching guest interactions:', error);
      throw error;
    }
  }

  /**
   * Analyze guest sentiment from interactions
   * @param {string} guestId - The guest ID
   * @returns {Promise<Object>} - Sentiment analysis results
   */
  static async analyzeGuestSentiment(guestId) {
    try {
      // Get recent interactions
      const interactions = await AIInteraction.find({ 
        guestId: mongoose.Types.ObjectId(guestId),
        sentimentScore: { $exists: true }
      })
      .sort({ timestamp: -1 })
      .limit(100);
      
      if (interactions.length === 0) {
        return {
          overallSentiment: 0,
          sentimentTrend: 'neutral',
          interactionCount: 0
        };
      }
      
      // Calculate average sentiment
      let totalSentiment = 0;
      interactions.forEach(interaction => {
        totalSentiment += interaction.sentimentScore || 0;
      });
      
      const overallSentiment = totalSentiment / interactions.length;
      
      // Determine sentiment trend
      const recentInteractions = interactions.slice(0, 10);
      const olderInteractions = interactions.slice(10, 20);
      
      let recentSentiment = 0;
      recentInteractions.forEach(interaction => {
        recentSentiment += interaction.sentimentScore || 0;
      });
      recentSentiment = recentSentiment / (recentInteractions.length || 1);
      
      let olderSentiment = 0;
      olderInteractions.forEach(interaction => {
        olderSentiment += interaction.sentimentScore || 0;
      });
      olderSentiment = olderSentiment / (olderInteractions.length || 1);
      
      let sentimentTrend = 'neutral';
      if (recentSentiment > olderSentiment + 0.1) {
        sentimentTrend = 'improving';
      } else if (recentSentiment < olderSentiment - 0.1) {
        sentimentTrend = 'declining';
      }
      
      // Update guest profile with sentiment score
      await Guest.findByIdAndUpdate(
        guestId,
        { 
          $set: { 
            sentimentScore: overallSentiment,
            updatedAt: new Date()
          }
        }
      );
      
      return {
        overallSentiment,
        sentimentTrend,
        interactionCount: interactions.length
      };
    } catch (error) {
      console.error('Error analyzing guest sentiment:', error);
      throw error;
    }
  }

  /**
   * Generate personalized recommendations for a guest
   * @param {string} guestId - The guest ID
   * @returns {Promise<Object>} - Personalized recommendations
   */
  static async generateRecommendations(guestId) {
    try {
      // Get guest profile
      const guest = await Guest.findById(guestId);
      if (!guest) {
        throw new Error('Guest not found');
      }
      
      // In a real implementation, this would use AI models
      // For now, we'll use a rule-based approach
      
      const recommendations = {
        roomPreferences: [],
        amenities: [],
        services: [],
        activities: [],
        foodBeverage: []
      };
      
      // Room preferences based on stay history
      if (guest.stayHistory && guest.stayHistory.length > 0) {
        // Find most common room type
        const roomTypes = {};
        guest.stayHistory.forEach(stay => {
          if (stay.roomType) {
            roomTypes[stay.roomType] = (roomTypes[stay.roomType] || 0) + 1;
          }
        });
        
        const preferredRoomType = Object.keys(roomTypes).reduce((a, b) => 
          roomTypes[a] > roomTypes[b] ? a : b, Object.keys(roomTypes)[0]);
        
        if (preferredRoomType) {
          recommendations.roomPreferences.push({
            type: 'room_type',
            value: preferredRoomType,
            confidence: 0.8,
            reason: 'Based on previous stay history'
          });
        }
      }
      
      // Amenities based on preferences
      if (guest.preferences && guest.preferences.amenities) {
        guest.preferences.amenities.forEach(amenity => {
          recommendations.amenities.push({
            type: 'amenity',
            value: amenity,
            confidence: 0.9,
            reason: 'Explicitly stated preference'
          });
        });
      }
      
      // Services based on spending profile
      if (guest.spendingProfile) {
        if (guest.spendingProfile.averageSpa > 100) {
          recommendations.services.push({
            type: 'service',
            value: 'Premium Spa Package',
            confidence: 0.7,
            reason: 'Based on spa spending history'
          });
        }
        
        if (guest.spendingProfile.averageFoodBeverage > 200) {
          recommendations.foodBeverage.push({
            type: 'dining',
            value: 'Fine Dining Experience',
            confidence: 0.8,
            reason: 'Based on F&B spending history'
          });
        }
      }
      
      // Activities based on behavior tags
      if (guest.behaviorTags) {
        if (guest.behaviorTags.includes('fitness_enthusiast')) {
          recommendations.activities.push({
            type: 'activity',
            value: 'Personal Training Session',
            confidence: 0.75,
            reason: 'Matches fitness enthusiast profile'
          });
        }
        
        if (guest.behaviorTags.includes('business_traveler')) {
          recommendations.services.push({
            type: 'service',
            value: 'Business Center Access',
            confidence: 0.85,
            reason: 'Matches business traveler profile'
          });
        }
        
        if (guest.behaviorTags.includes('family_traveler')) {
          recommendations.activities.push({
            type: 'activity',
            value: 'Family Pool Activities',
            confidence: 0.8,
            reason: 'Matches family traveler profile'
          });
        }
      }
      
      return {
        guestId,
        recommendations,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Process natural language query from guest
   * @param {string} guestId - The guest ID
   * @param {string} query - Natural language query
   * @param {string} hotelId - The hotel ID
   * @returns {Promise<Object>} - Response to query
   */
  static async processNaturalLanguageQuery(guestId, query, hotelId) {
    try {
      // In a real implementation, this would use NLP models
      // For now, we'll use a simple keyword-based approach
      
      // Record the interaction
      const interactionData = {
        hotelId: mongoose.Types.ObjectId(hotelId),
        guestId: mongoose.Types.ObjectId(guestId),
        sessionId: `session_${Date.now()}`,
        channel: 'chat',
        timestamp: new Date(),
        userInput: query,
        sentimentScore: 0 // Would be calculated by AI in real implementation
      };
      
      // Simple keyword matching
      let intent = 'unknown';
      let response = 'I\'m not sure how to help with that. Could you please rephrase?';
      let sentimentScore = 0;
      
      // Check for room service intent
      if (query.toLowerCase().includes('room service') || 
          query.toLowerCase().includes('food') || 
          query.toLowerCase().includes('hungry')) {
        intent = 'room_service';
        response = 'I\'d be happy to help you order room service. Our menu includes a variety of options from local cuisine to international favorites. Would you like me to show you the menu?';
        sentimentScore = 0.2;
      }
      
      // Check for housekeeping intent
      else if (query.toLowerCase().includes('clean') || 
               query.toLowerCase().includes('towel') || 
               query.toLowerCase().includes('housekeeping')) {
        intent = 'housekeeping';
        response = 'I\'ll arrange for housekeeping to visit your room. Is there anything specific you need, such as extra towels or toiletries?';
        sentimentScore = 0.1;
      }
      
      // Check for concierge intent
      else if (query.toLowerCase().includes('recommend') || 
               query.toLowerCase().includes('what to do') || 
               query.toLowerCase().includes('attraction')) {
        intent = 'concierge';
        response = 'As your personal concierge, I can recommend several attractions based on your preferences. Would you prefer cultural experiences, outdoor activities, or culinary adventures?';
        sentimentScore = 0.3;
      }
      
      // Check for complaint intent
      else if (query.toLowerCase().includes('problem') || 
               query.toLowerCase().includes('issue') || 
               query.toLowerCase().includes('not working') ||
               query.toLowerCase().includes('complaint')) {
        intent = 'complaint';
        response = 'I\'m sorry to hear you\'re experiencing an issue. I\'ll make sure this is addressed immediately. Could you provide more details so we can resolve this quickly?';
        sentimentScore = -0.5;
      }
      
      // Update interaction data with response and analysis
      interactionData.aiResponse = response;
      interactionData.intent = intent;
      interactionData.sentimentScore = sentimentScore;
      
      // Save the interaction
      await this.recordInteraction(interactionData);
      
      return {
        response,
        intent,
        sentimentScore,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error processing natural language query:', error);
      throw error;
    }
  }
}

module.exports = GuestDNAModel;
