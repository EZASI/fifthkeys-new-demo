/**
 * HotelTwin Module - Controller
 * 
 * This file contains the controller functions for the HotelTwin module.
 * These controllers handle HTTP requests and responses for the HotelTwin API.
 */

const HotelTwinModel = require('../models/hotelTwin');

class HotelTwinController {
  /**
   * Get digital twin model for a specific hotel
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getDigitalTwin(req, res) {
    try {
      const { hotelId } = req.params;
      
      if (!hotelId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: hotelId' 
        });
      }
      
      const digitalTwin = await HotelTwinModel.getDigitalTwin(hotelId);
      
      if (!digitalTwin) {
        return res.status(404).json({
          success: false,
          message: 'Digital twin not found for this hotel'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: digitalTwin
      });
    } catch (error) {
      console.error('Error in getDigitalTwin controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Create or update a digital twin model
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async saveDigitalTwin(req, res) {
    try {
      const twinData = req.body;
      
      if (!twinData || !twinData.hotelId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields in digital twin data' 
        });
      }
      
      const savedTwin = await HotelTwinModel.saveDigitalTwin(twinData);
      
      return res.status(201).json({
        success: true,
        message: 'Digital twin saved successfully',
        data: savedTwin
      });
    } catch (error) {
      console.error('Error in saveDigitalTwin controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get all spaces in a hotel's digital twin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getSpaces(req, res) {
    try {
      const { hotelId } = req.params;
      
      if (!hotelId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: hotelId' 
        });
      }
      
      const spaces = await HotelTwinModel.getSpaces(hotelId);
      
      return res.status(200).json({
        success: true,
        count: spaces.length,
        data: spaces
      });
    } catch (error) {
      console.error('Error in getSpaces controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Add or update a space in the digital twin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateSpace(req, res) {
    try {
      const { hotelId } = req.params;
      const spaceData = req.body;
      
      if (!hotelId || !spaceData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId and space data' 
        });
      }
      
      const updatedTwin = await HotelTwinModel.updateSpace(hotelId, spaceData);
      
      return res.status(200).json({
        success: true,
        message: 'Space updated successfully',
        data: updatedTwin
      });
    } catch (error) {
      console.error('Error in updateSpace controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get all assets in a hotel's digital twin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAssets(req, res) {
    try {
      const { hotelId } = req.params;
      
      if (!hotelId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: hotelId' 
        });
      }
      
      const assets = await HotelTwinModel.getAssets(hotelId);
      
      return res.status(200).json({
        success: true,
        count: assets.length,
        data: assets
      });
    } catch (error) {
      console.error('Error in getAssets controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Add or update an asset in the digital twin
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateAsset(req, res) {
    try {
      const { hotelId } = req.params;
      const assetData = req.body;
      
      if (!hotelId || !assetData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId and asset data' 
        });
      }
      
      const updatedTwin = await HotelTwinModel.updateAsset(hotelId, assetData);
      
      return res.status(200).json({
        success: true,
        message: 'Asset updated successfully',
        data: updatedTwin
      });
    } catch (error) {
      console.error('Error in updateAsset controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Get sensor data for a specific hotel
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getSensorData(req, res) {
    try {
      const { hotelId } = req.params;
      const filters = req.query;
      
      if (!hotelId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameter: hotelId' 
        });
      }
      
      const sensorData = await HotelTwinModel.getSensorData(hotelId, filters);
      
      return res.status(200).json({
        success: true,
        count: sensorData.length,
        data: sensorData
      });
    } catch (error) {
      console.error('Error in getSensorData controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Save new sensor data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async saveSensorData(req, res) {
    try {
      const sensorData = req.body;
      
      if (!sensorData || !sensorData.hotelId || !sensorData.sensorId || !sensorData.sensorType) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields in sensor data' 
        });
      }
      
      const savedData = await HotelTwinModel.saveSensorData(sensorData);
      
      return res.status(201).json({
        success: true,
        message: 'Sensor data saved successfully',
        data: savedData
      });
    } catch (error) {
      console.error('Error in saveSensorData controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Analyze space utilization
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async analyzeSpaceUtilization(req, res) {
    try {
      const { hotelId } = req.params;
      const { spaceId, startTime, endTime } = req.query;
      
      if (!hotelId || !startTime || !endTime) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, startTime, endTime' 
        });
      }
      
      const analysis = await HotelTwinModel.analyzeSpaceUtilization(
        hotelId, 
        spaceId, 
        new Date(startTime), 
        new Date(endTime)
      );
      
      return res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error in analyzeSpaceUtilization controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Analyze energy usage
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async analyzeEnergyUsage(req, res) {
    try {
      const { hotelId } = req.params;
      const { startTime, endTime } = req.query;
      
      if (!hotelId || !startTime || !endTime) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, startTime, endTime' 
        });
      }
      
      const analysis = await HotelTwinModel.analyzeEnergyUsage(
        hotelId, 
        new Date(startTime), 
        new Date(endTime)
      );
      
      return res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error in analyzeEnergyUsage controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * Run a simulation for space optimization
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async runSpaceOptimizationSimulation(req, res) {
    try {
      const { hotelId } = req.params;
      const simulationParams = req.body;
      
      if (!hotelId || !simulationParams || !simulationParams.targetSpaceId || !simulationParams.optimizationType) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters: hotelId, targetSpaceId, optimizationType' 
        });
      }
      
      const simulationResults = await HotelTwinModel.runSpaceOptimizationSimulation(
        hotelId, 
        simulationParams
      );
      
      return res.status(200).json({
        success: true,
        data: simulationResults
      });
    } catch (error) {
      console.error('Error in runSpaceOptimizationSimulation controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = HotelTwinController;
