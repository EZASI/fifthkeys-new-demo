/**
 * HotelTwin Module - Models
 * 
 * This file contains the business logic models for the HotelTwin module.
 * These models interact with the database schemas and implement the core functionality.
 */

const mongoose = require('mongoose');
const { DigitalTwin, SensorData, Hotel } = require('../../database/schema');

class HotelTwinModel {
  /**
   * Get digital twin model for a specific hotel
   * @param {string} hotelId - The hotel ID
   * @returns {Promise<Object>} - Digital twin model object
   */
  static async getDigitalTwin(hotelId) {
    try {
      // Get the latest version of the digital twin
      return await DigitalTwin.findOne({ 
        hotelId: mongoose.Types.ObjectId(hotelId) 
      }).sort({ lastUpdated: -1 });
    } catch (error) {
      console.error('Error fetching digital twin:', error);
      throw error;
    }
  }

  /**
   * Create or update a digital twin model
   * @param {Object} twinData - Digital twin model data
   * @returns {Promise<Object>} - Saved digital twin model
   */
  static async saveDigitalTwin(twinData) {
    try {
      // Create a new version of the digital twin
      const newTwin = new DigitalTwin({
        ...twinData,
        lastUpdated: new Date(),
        modelVersion: twinData.modelVersion || `v${Date.now()}`
      });
      
      return await newTwin.save();
    } catch (error) {
      console.error('Error saving digital twin:', error);
      throw error;
    }
  }

  /**
   * Get all spaces in a hotel's digital twin
   * @param {string} hotelId - The hotel ID
   * @returns {Promise<Array>} - Array of spaces
   */
  static async getSpaces(hotelId) {
    try {
      const digitalTwin = await this.getDigitalTwin(hotelId);
      
      if (!digitalTwin) {
        return [];
      }
      
      return digitalTwin.spaces || [];
    } catch (error) {
      console.error('Error fetching spaces:', error);
      throw error;
    }
  }

  /**
   * Add or update a space in the digital twin
   * @param {string} hotelId - The hotel ID
   * @param {Object} spaceData - Space data
   * @returns {Promise<Object>} - Updated digital twin
   */
  static async updateSpace(hotelId, spaceData) {
    try {
      const digitalTwin = await this.getDigitalTwin(hotelId);
      
      if (!digitalTwin) {
        throw new Error('Digital twin not found');
      }
      
      // Check if space already exists
      const existingSpaceIndex = digitalTwin.spaces.findIndex(
        space => space._id.toString() === spaceData._id
      );
      
      if (existingSpaceIndex >= 0) {
        // Update existing space
        digitalTwin.spaces[existingSpaceIndex] = {
          ...digitalTwin.spaces[existingSpaceIndex],
          ...spaceData,
          _id: digitalTwin.spaces[existingSpaceIndex]._id // Preserve original ID
        };
      } else {
        // Add new space
        digitalTwin.spaces.push(spaceData);
      }
      
      // Update the digital twin
      digitalTwin.lastUpdated = new Date();
      
      return await digitalTwin.save();
    } catch (error) {
      console.error('Error updating space:', error);
      throw error;
    }
  }

  /**
   * Get all assets in a hotel's digital twin
   * @param {string} hotelId - The hotel ID
   * @returns {Promise<Array>} - Array of assets
   */
  static async getAssets(hotelId) {
    try {
      const digitalTwin = await this.getDigitalTwin(hotelId);
      
      if (!digitalTwin) {
        return [];
      }
      
      return digitalTwin.assets || [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }

  /**
   * Add or update an asset in the digital twin
   * @param {string} hotelId - The hotel ID
   * @param {Object} assetData - Asset data
   * @returns {Promise<Object>} - Updated digital twin
   */
  static async updateAsset(hotelId, assetData) {
    try {
      const digitalTwin = await this.getDigitalTwin(hotelId);
      
      if (!digitalTwin) {
        throw new Error('Digital twin not found');
      }
      
      // Check if asset already exists
      const existingAssetIndex = digitalTwin.assets.findIndex(
        asset => asset._id.toString() === assetData._id
      );
      
      if (existingAssetIndex >= 0) {
        // Update existing asset
        digitalTwin.assets[existingAssetIndex] = {
          ...digitalTwin.assets[existingAssetIndex],
          ...assetData,
          _id: digitalTwin.assets[existingAssetIndex]._id // Preserve original ID
        };
      } else {
        // Add new asset
        digitalTwin.assets.push(assetData);
      }
      
      // Update the digital twin
      digitalTwin.lastUpdated = new Date();
      
      return await digitalTwin.save();
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  }

  /**
   * Get sensor data for a specific hotel
   * @param {string} hotelId - The hotel ID
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} - Array of sensor data
   */
  static async getSensorData(hotelId, filters = {}) {
    try {
      const query = { hotelId: mongoose.Types.ObjectId(hotelId) };
      
      // Add filters
      if (filters.sensorId) {
        query.sensorId = filters.sensorId;
      }
      
      if (filters.sensorType) {
        query.sensorType = filters.sensorType;
      }
      
      if (filters.spaceId) {
        query['location.spaceId'] = filters.spaceId;
      }
      
      if (filters.startTime && filters.endTime) {
        query.timestamp = { 
          $gte: new Date(filters.startTime), 
          $lte: new Date(filters.endTime) 
        };
      } else if (filters.startTime) {
        query.timestamp = { $gte: new Date(filters.startTime) };
      } else if (filters.endTime) {
        query.timestamp = { $lte: new Date(filters.endTime) };
      }
      
      // Pagination
      const limit = filters.limit || 100;
      const skip = filters.page ? (filters.page - 1) * limit : 0;
      
      return await SensorData.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  /**
   * Save new sensor data
   * @param {Object} sensorData - Sensor data
   * @returns {Promise<Object>} - Saved sensor data
   */
  static async saveSensorData(sensorData) {
    try {
      const newSensorData = new SensorData({
        ...sensorData,
        timestamp: sensorData.timestamp || new Date()
      });
      
      return await newSensorData.save();
    } catch (error) {
      console.error('Error saving sensor data:', error);
      throw error;
    }
  }

  /**
   * Analyze space utilization
   * @param {string} hotelId - The hotel ID
   * @param {string} spaceId - The space ID (optional)
   * @param {Date} startTime - Start time for analysis
   * @param {Date} endTime - End time for analysis
   * @returns {Promise<Object>} - Space utilization analysis
   */
  static async analyzeSpaceUtilization(hotelId, spaceId, startTime, endTime) {
    try {
      // Get occupancy sensor data for the specified time period
      const filters = {
        sensorType: 'occupancy',
        startTime,
        endTime
      };
      
      if (spaceId) {
        filters.spaceId = spaceId;
      }
      
      const sensorData = await this.getSensorData(hotelId, filters);
      
      // Get spaces from digital twin
      const spaces = await this.getSpaces(hotelId);
      
      // Group sensor data by space
      const spaceUtilization = {};
      
      // Initialize with all spaces
      spaces.forEach(space => {
        spaceUtilization[space._id] = {
          spaceId: space._id,
          spaceName: space.name,
          spaceType: space.type,
          totalReadings: 0,
          occupiedReadings: 0,
          averageOccupancy: 0,
          peakOccupancy: 0,
          peakTime: null,
          lowOccupancy: 100,
          lowTime: null
        };
      });
      
      // Process sensor data
      sensorData.forEach(data => {
        if (data.location && data.location.spaceId) {
          const spaceId = data.location.spaceId;
          
          if (!spaceUtilization[spaceId]) {
            // Space not in digital twin, initialize
            spaceUtilization[spaceId] = {
              spaceId,
              spaceName: 'Unknown',
              spaceType: 'Unknown',
              totalReadings: 0,
              occupiedReadings: 0,
              averageOccupancy: 0,
              peakOccupancy: 0,
              peakTime: null,
              lowOccupancy: 100,
              lowTime: null
            };
          }
          
          // Update utilization data
          const space = spaceUtilization[spaceId];
          space.totalReadings++;
          
          // Assuming value is occupancy percentage
          const occupancy = parseFloat(data.value);
          
          if (!isNaN(occupancy)) {
            if (occupancy > 0) {
              space.occupiedReadings++;
            }
            
            // Check for peak and low occupancy
            if (occupancy > space.peakOccupancy) {
              space.peakOccupancy = occupancy;
              space.peakTime = data.timestamp;
            }
            
            if (occupancy < space.lowOccupancy) {
              space.lowOccupancy = occupancy;
              space.lowTime = data.timestamp;
            }
          }
        }
      });
      
      // Calculate average occupancy
      Object.values(spaceUtilization).forEach(space => {
        if (space.totalReadings > 0) {
          space.averageOccupancy = (space.occupiedReadings / space.totalReadings) * 100;
        }
      });
      
      return {
        hotelId,
        startTime,
        endTime,
        spaces: Object.values(spaceUtilization)
      };
    } catch (error) {
      console.error('Error analyzing space utilization:', error);
      throw error;
    }
  }

  /**
   * Analyze energy usage
   * @param {string} hotelId - The hotel ID
   * @param {Date} startTime - Start time for analysis
   * @param {Date} endTime - End time for analysis
   * @returns {Promise<Object>} - Energy usage analysis
   */
  static async analyzeEnergyUsage(hotelId, startTime, endTime) {
    try {
      // Get energy sensor data for the specified time period
      const energyData = await this.getSensorData(hotelId, {
        sensorType: 'energy',
        startTime,
        endTime
      });
      
      // Get spaces from digital twin
      const spaces = await this.getSpaces(hotelId);
      
      // Group energy data by space
      const spaceEnergy = {};
      
      // Initialize with all spaces
      spaces.forEach(space => {
        spaceEnergy[space._id] = {
          spaceId: space._id,
          spaceName: space.name,
          spaceType: space.type,
          totalEnergy: 0,
          readings: 0,
          averageEnergy: 0,
          peakEnergy: 0,
          peakTime: null
        };
      });
      
      // Process energy data
      energyData.forEach(data => {
        if (data.location && data.location.spaceId) {
          const spaceId = data.location.spaceId;
          
          if (!spaceEnergy[spaceId]) {
            // Space not in digital twin, initialize
            spaceEnergy[spaceId] = {
              spaceId,
              spaceName: 'Unknown',
              spaceType: 'Unknown',
              totalEnergy: 0,
              readings: 0,
              averageEnergy: 0,
              peakEnergy: 0,
              peakTime: null
            };
          }
          
          // Update energy data
          const space = spaceEnergy[spaceId];
          space.readings++;
          
          // Assuming value is energy consumption in kWh
          const energy = parseFloat(data.value);
          
          if (!isNaN(energy)) {
            space.totalEnergy += energy;
            
            // Check for peak energy
            if (energy > space.peakEnergy) {
              space.peakEnergy = energy;
              space.peakTime = data.timestamp;
            }
          }
        }
      });
      
      // Calculate average energy
      Object.values(spaceEnergy).forEach(space => {
        if (space.readings > 0) {
          space.averageEnergy = space.totalEnergy / space.readings;
        }
      });
      
      // Calculate total hotel energy
      const totalEnergy = Object.values(spaceEnergy).reduce(
        (sum, space) => sum + space.totalEnergy, 0
      );
      
      return {
        hotelId,
        startTime,
        endTime,
        totalEnergy,
        spaces: Object.values(spaceEnergy)
      };
    } catch (error) {
      console.error('Error analyzing energy usage:', error);
      throw error;
    }
  }

  /**
   * Run a simulation for space optimization
   * @param {string} hotelId - The hotel ID
   * @param {Object} simulationParams - Simulation parameters
   * @returns {Promise<Object>} - Simulation results
   */
  static async runSpaceOptimizationSimulation(hotelId, simulationParams) {
    try {
      // In a real implementation, this would use sophisticated simulation models
      // For now, we'll implement a simplified version
      
      const { 
        targetSpaceId, 
        optimizationType, 
        constraints 
      } = simulationParams;
      
      // Get the digital twin
      const digitalTwin = await this.getDigitalTwin(hotelId);
      if (!digitalTwin) {
        throw new Error('Digital twin not found');
      }
      
      // Get the target space
      const targetSpace = digitalTwin.spaces.find(
        space => space._id.toString() === targetSpaceId
      );
      
      if (!targetSpace) {
        throw new Error('Target space not found');
      }
      
      // Get historical utilization data
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const utilizationData = await this.analyzeSpaceUtilization(
        hotelId, 
        targetSpaceId, 
        oneMonthAgo, 
        new Date()
      );
      
      // Get space utilization
      const spaceUtilization = utilizationData.spaces.find(
        space => space.spaceId.toString() === targetSpaceId
      );
      
      // Run simulation based on optimization type
      let simulationResults = {};
      
      switch (optimizationType) {
        case 'capacity':
          simulationResults = this.simulateCapacityOptimization(
            targetSpace, 
            spaceUtilization, 
            constraints
          );
          break;
          
        case 'layout':
          simulationResults = this.simulateLayoutOptimization(
            targetSpace, 
            spaceUtilization, 
            constraints
          );
          break;
          
        case 'energy':
          simulationResults = this.simulateEnergyOptimization(
            targetSpace, 
            spaceUtilization, 
            constraints
          );
          break;
          
        default:
          throw new Error(`Unsupported optimization type: ${optimizationType}`);
      }
      
      return {
        hotelId,
        targetSpaceId,
        optimizationType,
        currentState: {
          space: targetSpace,
          utilization: spaceUtilization
        },
        simulationResults
      };
    } catch (error) {
      console.error('Error running space optimization simulation:', error);
      throw error;
    }
  }

  /**
   * Simulate capacity optimization
   * @param {Object} space - Space data
   * @param {Object} utilization - Space utilization data
   * @param {Object} constraints - Simulation constraints
   * @returns {Object} - Simulation results
   */
  static simulateCapacityOptimization(space, utilization, constraints) {
    // Simple capacity optimization algorithm
    const currentCapacity = space.capacity || 0;
    const averageOccupancy = utilization.averageOccupancy || 0;
    const peakOccupancy = utilization.peakOccupancy || 0;
    const peakTime = utilization.peakTime || null;
    const lowOccupancy = utilization.lowOccupancy || 100;
    const lowTime = utilization.lowTime || null;
    
    // Implementation of capacity optimization logic
    // This is a placeholder and should be replaced with actual implementation
    const optimizedCapacity = currentCapacity;
    
    return {
      spaceId: space._id,
      spaceName: space.name,
      spaceType: space.type,
      currentCapacity,
      optimizedCapacity,
      averageOccupancy,
      peakOccupancy,
      peakTime,
      lowOccupancy,
      lowTime
    };
  }

  /**
   * Simulate layout optimization
   * @param {Object} space - Space data
   * @param {Object} utilization - Space utilization data
   * @param {Object} constraints - Simulation constraints
   * @returns {Object} - Simulation results
   */
  static simulateLayoutOptimization(space, utilization, constraints) {
    // Implementation of layout optimization logic
    // This is a placeholder and should be replaced with actual implementation
    const optimizedLayout = space.layout;
    
    return {
      spaceId: space._id,
      spaceName: space.name,
      spaceType: space.type,
      currentLayout: space.layout,
      optimizedLayout
    };
  }

  /**
   * Simulate energy optimization
   * @param {Object} space - Space data
   * @param {Object} utilization - Space utilization data
   * @param {Object} constraints - Simulation constraints
   * @returns {Object} - Simulation results
   */
  static simulateEnergyOptimization(space, utilization, constraints) {
    // Implementation of energy optimization logic
    // This is a placeholder and should be replaced with actual implementation
    const optimizedEnergy = space.energy;
    
    return {
      spaceId: space._id,
      spaceName: space.name,
      spaceType: space.type,
      currentEnergy: space.energy,
      optimizedEnergy
    };
  }
}

module.exports = HotelTwinModel;