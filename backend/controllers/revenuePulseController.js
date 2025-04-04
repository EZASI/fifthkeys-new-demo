/**
 * RevenuePulse Module - Controller
 * 
 * This file contains the controller functions for the RevenuePulse module.
 * These controllers handle HTTP requests and responses for the RevenuePulse API.
 */

const RevenuePulseModel = require('../models/revenuePulse');

class RevenuePulseController {
  /**
   * Get revenue data for a specific hotel and date range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getRevenueData(req, res) {
    try {
      const { hotelId, startDate, endDate } = req.query;
      
      if (!hotelId || !startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, startDate, endDate' 
        });
      }
      
      const revenueData = await RevenuePulseModel.getRevenueData(
        hotelId, 
        new Date(startDate), 
        new Date(endDate)
      );
      
      return res.status(200).json({
        success: true,
        data: revenueData
      });
    } catch (error) {
      console.error('Error in getRevenueData controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get market data for a specific hotel and date range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getMarketData(req, res) {
    try {
      const { hotelId, startDate, endDate } = req.query;
      
      if (!hotelId || !startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, startDate, endDate' 
        });
      }
      
      const marketData = await RevenuePulseModel.getMarketData(
        hotelId, 
        new Date(startDate), 
        new Date(endDate)
      );
      
      return res.status(200).json({
        success: true,
        data: marketData
      });
    } catch (error) {
      console.error('Error in getMarketData controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Calculate KPIs for a specific hotel and date range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async calculateKPIs(req, res) {
    try {
      const { hotelId, startDate, endDate } = req.query;
      
      if (!hotelId || !startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, startDate, endDate' 
        });
      }
      
      const kpis = await RevenuePulseModel.calculateKPIs(
        hotelId, 
        new Date(startDate), 
        new Date(endDate)
      );
      
      return res.status(200).json({
        success: true,
        data: kpis
      });
    } catch (error) {
      console.error('Error in calculateKPIs controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Predict demand for a specific hotel and date range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async predictDemand(req, res) {
    try {
      const { hotelId, targetDate, daysAhead } = req.query;
      
      if (!hotelId || !targetDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, targetDate' 
        });
      }
      
      const demandPrediction = await RevenuePulseModel.predictDemand(
        hotelId, 
        new Date(targetDate), 
        daysAhead ? parseInt(daysAhead) : 30
      );
      
      return res.status(200).json({
        success: true,
        data: demandPrediction
      });
    } catch (error) {
      console.error('Error in predictDemand controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get pricing recommendations for a specific hotel and date range
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async recommendPricing(req, res) {
    try {
      const { hotelId, targetDate, daysAhead } = req.query;
      
      if (!hotelId || !targetDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, targetDate' 
        });
      }
      
      const pricingRecommendations = await RevenuePulseModel.recommendPricing(
        hotelId, 
        new Date(targetDate), 
        daysAhead ? parseInt(daysAhead) : 30
      );
      
      return res.status(200).json({
        success: true,
        data: pricingRecommendations
      });
    } catch (error) {
      console.error('Error in recommendPricing controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Run a "What-If" scenario simulation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async runSimulation(req, res) {
    try {
      const { hotelId } = req.params;
      const scenario = req.body;
      
      if (!hotelId || !scenario) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId and scenario data' 
        });
      }
      
      // Validate scenario data
      const requiredFields = ['startDate', 'endDate', 'priceChange'];
      for (const field of requiredFields) {
        if (scenario[field] === undefined) {
          return res.status(400).json({
            success: false,
            message: `Missing required scenario field: ${field}`
          });
        }
      }
      
      // Parse dates and numeric values
      scenario.startDate = new Date(scenario.startDate);
      scenario.endDate = new Date(scenario.endDate);
      scenario.priceChange = parseFloat(scenario.priceChange);
      if (scenario.marketingSpend) scenario.marketingSpend = parseFloat(scenario.marketingSpend);
      if (scenario.competitorPriceChange) scenario.competitorPriceChange = parseFloat(scenario.competitorPriceChange);
      
      const simulationResults = await RevenuePulseModel.runSimulation(hotelId, scenario);
      
      return res.status(200).json({
        success: true,
        data: simulationResults
      });
    } catch (error) {
      console.error('Error in runSimulation controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Save new revenue data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async saveRevenueData(req, res) {
    try {
      const revenueData = req.body;
      
      if (!revenueData || !revenueData.hotelId || !revenueData.date) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields in revenue data' 
        });
      }
      
      // Parse date
      revenueData.date = new Date(revenueData.date);
      
      const savedData = await RevenuePulseModel.saveRevenueData(revenueData);
      
      return res.status(201).json({
        success: true,
        message: 'Revenue data saved successfully',
        data: savedData
      });
    } catch (error) {
      console.error('Error in saveRevenueData controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Save new market data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async saveMarketData(req, res) {
    try {
      const marketData = req.body;
      
      if (!marketData || !marketData.hotelId || !marketData.date) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields in market data' 
        });
      }
      
      // Parse date
      marketData.date = new Date(marketData.date);
      
      const savedData = await RevenuePulseModel.saveMarketData(marketData);
      
      return res.status(201).json({
        success: true,
        message: 'Market data saved successfully',
        data: savedData
      });
    } catch (error) {
      console.error('Error in saveMarketData controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = RevenuePulseController;
