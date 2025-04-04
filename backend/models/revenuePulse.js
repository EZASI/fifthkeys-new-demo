/**
 * RevenuePulse Module - Models
 * 
 * This file contains the business logic models for the RevenuePulse module.
 * These models interact with the database schemas and implement the core functionality.
 */

const mongoose = require('mongoose');
const { RevenueData, MarketData, Hotel } = require('../../database/schema');

class RevenuePulseModel {
  /**
   * Get revenue data for a specific hotel and date range
   * @param {string} hotelId - The hotel ID
   * @param {Date} startDate - Start date for data retrieval
   * @param {Date} endDate - End date for data retrieval
   * @returns {Promise<Array>} - Array of revenue data objects
   */
  static async getRevenueData(hotelId, startDate, endDate) {
    try {
      return await RevenueData.find({
        hotelId: mongoose.Types.ObjectId(hotelId),
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }

  /**
   * Get market data for a specific hotel and date range
   * @param {string} hotelId - The hotel ID
   * @param {Date} startDate - Start date for data retrieval
   * @param {Date} endDate - End date for data retrieval
   * @returns {Promise<Array>} - Array of market data objects
   */
  static async getMarketData(hotelId, startDate, endDate) {
    try {
      return await MarketData.find({
        hotelId: mongoose.Types.ObjectId(hotelId),
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  /**
   * Calculate key performance indicators for a hotel
   * @param {string} hotelId - The hotel ID
   * @param {Date} startDate - Start date for calculation
   * @param {Date} endDate - End date for calculation
   * @returns {Promise<Object>} - Object containing KPIs
   */
  static async calculateKPIs(hotelId, startDate, endDate) {
    try {
      const revenueData = await this.getRevenueData(hotelId, startDate, endDate);
      
      if (!revenueData || revenueData.length === 0) {
        return {
          totalRevenue: 0,
          averageOccupancy: 0,
          averageADR: 0,
          averageRevPAR: 0,
          revenueBreakdown: {
            room: 0,
            foodBeverage: 0,
            spa: 0,
            retail: 0,
            other: 0
          }
        };
      }

      // Calculate totals
      let totalRevenue = 0;
      let totalRoomRevenue = 0;
      let totalFBRevenue = 0;
      let totalSpaRevenue = 0;
      let totalRetailRevenue = 0;
      let totalOtherRevenue = 0;
      let totalOccupancy = 0;
      let totalADR = 0;
      let totalRevPAR = 0;

      revenueData.forEach(data => {
        totalRevenue += data.totalRevenue || 0;
        totalRoomRevenue += data.roomRevenue || 0;
        totalFBRevenue += data.foodBeverageRevenue || 0;
        totalSpaRevenue += data.spaRevenue || 0;
        totalRetailRevenue += data.retailRevenue || 0;
        totalOtherRevenue += data.otherRevenue || 0;
        totalOccupancy += data.occupancyRate || 0;
        totalADR += data.adr || 0;
        totalRevPAR += data.revPAR || 0;
      });

      // Calculate averages
      const dataPoints = revenueData.length;
      const averageOccupancy = totalOccupancy / dataPoints;
      const averageADR = totalADR / dataPoints;
      const averageRevPAR = totalRevPAR / dataPoints;

      return {
        totalRevenue,
        averageOccupancy,
        averageADR,
        averageRevPAR,
        revenueBreakdown: {
          room: totalRoomRevenue,
          foodBeverage: totalFBRevenue,
          spa: totalSpaRevenue,
          retail: totalRetailRevenue,
          other: totalOtherRevenue
        }
      };
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      throw error;
    }
  }

  /**
   * Predict future demand based on historical data and market factors
   * @param {string} hotelId - The hotel ID
   * @param {Date} targetDate - The date to predict demand for
   * @param {number} daysAhead - Number of days to predict ahead
   * @returns {Promise<Object>} - Predicted demand data
   */
  static async predictDemand(hotelId, targetDate, daysAhead = 30) {
    try {
      // For a real implementation, this would use the AI models
      // For now, we'll return a placeholder implementation
      
      // Get historical data for the past 90 days
      const endDate = new Date(targetDate);
      const startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - 90);
      
      const revenueData = await this.getRevenueData(hotelId, startDate, endDate);
      const marketData = await this.getMarketData(hotelId, startDate, endDate);
      
      // Calculate average occupancy from historical data
      let totalOccupancy = 0;
      revenueData.forEach(data => {
        totalOccupancy += data.occupancyRate || 0;
      });
      const avgOccupancy = revenueData.length > 0 ? totalOccupancy / revenueData.length : 0;
      
      // Generate predictions for each day in the forecast period
      const predictions = [];
      const forecastStartDate = new Date(targetDate);
      
      for (let i = 0; i < daysAhead; i++) {
        const forecastDate = new Date(forecastStartDate);
        forecastDate.setDate(forecastDate.getDate() + i);
        
        // In a real implementation, this would use machine learning models
        // For now, we'll use a simple algorithm based on historical data
        
        // Check if there are any events on this date from market data
        const eventsImpact = 1.0; // Default no impact
        const relevantMarketData = marketData.find(data => {
          const dataDate = new Date(data.date);
          return dataDate.toDateString() === forecastDate.toDateString();
        });
        
        if (relevantMarketData && relevantMarketData.events && relevantMarketData.events.length > 0) {
          // Simple impact calculation based on event importance
          relevantMarketData.events.forEach(event => {
            if (event.expectedImpact === 'high') eventsImpact += 0.2;
            else if (event.expectedImpact === 'medium') eventsImpact += 0.1;
            else if (event.expectedImpact === 'low') eventsImpact += 0.05;
          });
        }
        
        // Day of week factor (weekend vs weekday)
        const dayOfWeek = forecastDate.getDay(); // 0 = Sunday, 6 = Saturday
        const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) ? 1.2 : 1.0;
        
        // Seasonality factor (simplified)
        const month = forecastDate.getMonth(); // 0-11
        let seasonalityFactor = 1.0;
        
        // Simple seasonal adjustments (would be more sophisticated in real implementation)
        if (month >= 5 && month <= 8) { // Summer months
          seasonalityFactor = 1.3;
        } else if (month >= 11 || month <= 1) { // Winter holiday months
          seasonalityFactor = 1.2;
        } else if (month >= 2 && month <= 4) { // Spring
          seasonalityFactor = 1.1;
        } else { // Fall
          seasonalityFactor = 0.9;
        }
        
        // Calculate predicted occupancy
        const predictedOccupancy = Math.min(
          100, 
          Math.max(0, avgOccupancy * weekendFactor * seasonalityFactor * eventsImpact)
        );
        
        // Calculate predicted ADR based on occupancy
        // Higher occupancy generally means higher rates
        const baseADR = revenueData.length > 0 ? 
          revenueData.reduce((sum, data) => sum + (data.adr || 0), 0) / revenueData.length : 
          100; // Default value
        
        const occupancyADRFactor = predictedOccupancy > 80 ? 1.3 : 
                                  predictedOccupancy > 60 ? 1.1 : 
                                  predictedOccupancy > 40 ? 0.9 : 0.8;
        
        const predictedADR = baseADR * occupancyADRFactor * seasonalityFactor;
        
        // Calculate RevPAR
        const predictedRevPAR = predictedOccupancy * predictedADR / 100;
        
        predictions.push({
          date: forecastDate,
          predictedOccupancy,
          predictedADR,
          predictedRevPAR,
          factors: {
            weekendFactor,
            seasonalityFactor,
            eventsImpact
          }
        });
      }
      
      return {
        hotelId,
        targetDate,
        daysAhead,
        predictions
      };
    } catch (error) {
      console.error('Error predicting demand:', error);
      throw error;
    }
  }

  /**
   * Recommend optimal pricing strategy based on demand forecast
   * @param {string} hotelId - The hotel ID
   * @param {Date} targetDate - The date to generate recommendations for
   * @param {number} daysAhead - Number of days to recommend ahead
   * @returns {Promise<Object>} - Pricing recommendations
   */
  static async recommendPricing(hotelId, targetDate, daysAhead = 30) {
    try {
      // Get demand predictions
      const demandForecast = await this.predictDemand(hotelId, targetDate, daysAhead);
      
      // Get hotel information for room types
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
      
      // In a real implementation, we would have room types in the hotel model
      // For now, we'll use placeholder room types
      const roomTypes = [
        { name: 'Standard', basePrice: 100 },
        { name: 'Deluxe', basePrice: 150 },
        { name: 'Suite', basePrice: 250 },
        { name: 'Executive Suite', basePrice: 350 }
      ];
      
      // Generate pricing recommendations for each day and room type
      const recommendations = [];
      
      demandForecast.predictions.forEach(prediction => {
        const dailyRecommendation = {
          date: prediction.date,
          occupancyForecast: prediction.predictedOccupancy,
          roomTypes: []
        };
        
        roomTypes.forEach(roomType => {
          // Calculate room type specific factors
          // Premium room types can command higher premiums during high demand
          const roomTypeFactor = roomType.name === 'Standard' ? 1.0 :
                                roomType.name === 'Deluxe' ? 1.1 :
                                roomType.name === 'Suite' ? 1.2 : 1.3;
          
          // Calculate recommended price based on demand
          const demandFactor = prediction.predictedOccupancy > 80 ? 1.4 :
                              prediction.predictedOccupancy > 60 ? 1.2 :
                              prediction.predictedOccupancy > 40 ? 1.0 : 0.9;
          
          const recommendedPrice = Math.round(
            roomType.basePrice * 
            demandFactor * 
            roomTypeFactor * 
            prediction.factors.seasonalityFactor
          );
          
          // Calculate minimum and maximum recommended prices
          const minPrice = Math.round(recommendedPrice * 0.9);
          const maxPrice = Math.round(recommendedPrice * 1.1);
          
          dailyRecommendation.roomTypes.push({
            roomType: roomType.name,
            recommendedPrice,
            priceRange: {
              min: minPrice,
              max: maxPrice
            },
            expectedRevenue: recommendedPrice * (prediction.predictedOccupancy / 100)
          });
        });
        
        recommendations.push(dailyRecommendation);
      });
      
      return {
        hotelId,
        targetDate,
        daysAhead,
        recommendations
      };
    } catch (error) {
      console.error('Error recommending pricing:', error);
      throw error;
    }
  }

  /**
   * Run a "What-If" scenario simulation
   * @param {string} hotelId - The hotel ID
   * @param {Object} scenario - Scenario parameters
   * @returns {Promise<Object>} - Simulation results
   */
  static async runSimulation(hotelId, scenario) {
    try {
      // In a real implementation, this would use sophisticated simulation models
      // For now, we'll implement a simplified version
      
      const { 
        startDate, 
        endDate, 
        priceChange, 
        marketingSpend, 
        competitorPriceChange 
      } = scenario;
      
      // Get baseline data
      const baselineForecast = await this.predictDemand(hotelId, startDate, 
        Math.round((new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000))
      );
      
      // Calculate impact of price change on demand
      // Simple price elasticity model: 10% price increase = 5% demand decrease
      const priceElasticity = -0.5;
      const demandChangeFromPrice = priceChange * priceElasticity;
      
      // Calculate impact of marketing spend
      // Simple model: Each $1000 in marketing increases demand by 2% up to a cap
      const marketingImpact = Math.min(0.1, (marketingSpend / 1000) * 0.02);
      
      // Calculate impact of competitor price change
      // If competitors raise prices, we gain demand; if they lower prices, we lose demand
      const competitorImpact = competitorPriceChange * 0.3;
      
      // Apply impacts to baseline forecast
      const simulatedPredictions = baselineForecast.predictions.map(prediction => {
        // Calculate new occupancy based on all factors
        const occupancyChange = demandChangeFromPrice + marketingImpact + competitorImpact;
        const newOccupancy = Math.min(100, Math.max(0, 
          prediction.predictedOccupancy * (1 + occupancyChange)
        ));
        
        // Calculate new ADR based on price change
        const newADR = prediction.predictedADR * (1 + priceChange / 100);
        
        // Calculate new RevPAR
        const newRevPAR = newOccupancy * newADR / 100;
        
        return {
          date: prediction.date,
          baseline: {
            occupancy: prediction.predictedOccupancy,
            adr: prediction.predictedADR,
            revPAR: prediction.predictedRevPAR
          },
          simulated: {
            occupancy: newOccupancy,
            adr: newADR,
            revPAR: newRevPAR
          },
          change: {
            occupancy: newOccupancy - prediction.predictedOccupancy,
            adr: newADR - prediction.predictedADR,
            revPAR: newRevPAR - prediction.predictedRevPAR
          }
        };
      });
      
      // Calculate summary statistics
      const baselineTotalRevPAR = baselineForecast.predictions.reduce(
        (sum, p) => sum + p.predictedRevPAR, 0
      );
      
      const simulatedTotalRevPAR = simulatedPredictions.reduce(
        (sum, p) => sum + p.simulated.revPAR, 0
      );
      
      const totalRevPARChange = simulatedTotalRevPAR - baselineTotalRevPAR;
      const percentRevPARChange = (totalRevPARChange / baselineTotalRevPAR) * 100;
      
      // Calculate ROI if marketing spend is provided
      const roi = marketingSpend > 0 ? 
        (totalRevPARChange / marketingSpend) * 100 : 
        null;
      
      return {
        hotelId,
        scenario,
        summary: {
          baselineTotalRevPAR,
          simulatedTotalRevPAR,
          totalRevPARChange,
          percentRevPARChange,
          roi
        },
        dailyResults: simulatedPredictions
      };
    } catch (error) {
      console.error('Error running simulation:', error);
      throw error;
    }
  }

  /**
   * Save new revenue data
   * @param {Object} revenueData - Revenue data to save
   * @returns {Promise<Object>} - Saved revenue data
   */
  static async saveRevenueData(revenueData) {
    try {
      const newRevenueData = new RevenueData(revenueData);
      return await newRevenueData.save();
    } catch (error) {
      console.error('Error saving revenue data:', error);
      throw error;
    }
  }

  /**
   * Save new market data
   * @param {Object} marketData - Market data to save
   * @returns {Promise<Object>} - Saved market data
   */
  static async saveMarketData(marketData) {
    try {
      const newMarketData = new MarketData(marketData);
      return await newMarketData.save();
    } catch (error) {
      console.error('Error saving market data:', error);
      throw error;
    }
  }
}

module.exports = RevenuePulseModel;