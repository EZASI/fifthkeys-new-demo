/**
 * Data API Service
 * 
 * This file contains the implementation of data API services
 * for connecting the frontend visualization components with backend data.
 */

import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * RevenuePulse Data API Service
 */
export const RevenuePulseDataService = {
  /**
   * Get revenue trends data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with revenue data
   */
  getRevenueTrends: async (timeRange = 'month', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/revenue-pulse/trends`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue trends:', error);
      throw error;
    }
  },

  /**
   * Get occupancy forecast data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with occupancy data
   */
  getOccupancyForecast: async (timeRange = 'month', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/revenue-pulse/occupancy`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching occupancy forecast:', error);
      throw error;
    }
  },

  /**
   * Get price optimization scenarios
   * @param {string} roomType - Room type
   * @param {string} dateRange - Date range for optimization
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with price optimization data
   */
  getPriceOptimization: async (roomType, dateRange, hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/revenue-pulse/price-optimization`, {
        params: { roomType, dateRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching price optimization:', error);
      throw error;
    }
  },

  /**
   * Get market intelligence data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with market intelligence data
   */
  getMarketIntelligence: async (timeRange = 'month', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/revenue-pulse/market-intelligence`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      throw error;
    }
  },

  /**
   * Run revenue simulation
   * @param {Object} simulationParams - Simulation parameters
   * @returns {Promise} - Promise with simulation results
   */
  runRevenueSimulation: async (simulationParams) => {
    try {
      const response = await axios.post(`${API_URL}/revenue-pulse/simulation`, simulationParams);
      return response.data;
    } catch (error) {
      console.error('Error running revenue simulation:', error);
      throw error;
    }
  }
};

/**
 * GuestDNA Data API Service
 */
export const GuestDNADataService = {
  /**
   * Get guest sentiment data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with sentiment data
   */
  getGuestSentiment: async (timeRange = 'month', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/guest-dna/sentiment`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching guest sentiment:', error);
      throw error;
    }
  },

  /**
   * Get guest preferences data
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with preferences data
   */
  getGuestPreferences: async (hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/guest-dna/preferences`, {
        params: { hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching guest preferences:', error);
      throw error;
    }
  },

  /**
   * Get guest profile data
   * @param {string} guestId - Guest ID
   * @returns {Promise} - Promise with guest profile data
   */
  getGuestProfile: async (guestId) => {
    try {
      const response = await axios.get(`${API_URL}/guest-dna/guests/${guestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching guest profile:', error);
      throw error;
    }
  },

  /**
   * Search for guests
   * @param {Object} searchParams - Search parameters
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with search results
   */
  searchGuests: async (searchParams, hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/guest-dna/search`, {
        params: { ...searchParams, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching guests:', error);
      throw error;
    }
  },

  /**
   * Get AI interaction data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with interaction data
   */
  getAIInteractions: async (timeRange = 'month', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/guest-dna/interactions`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching AI interactions:', error);
      throw error;
    }
  }
};

/**
 * HotelTwin Data API Service
 */
export const HotelTwinDataService = {
  /**
   * Get space utilization data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with space utilization data
   */
  getSpaceUtilization: async (timeRange = 'day', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/hotel-twin/space-utilization`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching space utilization:', error);
      throw error;
    }
  },

  /**
   * Get energy usage data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with energy usage data
   */
  getEnergyUsage: async (timeRange = 'day', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/hotel-twin/energy-usage`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching energy usage:', error);
      throw error;
    }
  },

  /**
   * Get space heatmap data
   * @param {string} spaceId - Space ID
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with heatmap data
   */
  getSpaceHeatmap: async (spaceId, hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/hotel-twin/heatmap`, {
        params: { spaceId, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching space heatmap:', error);
      throw error;
    }
  },

  /**
   * Get digital twin model
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with digital twin model data
   */
  getDigitalTwin: async (hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/hotel-twin/digital-twin`, {
        params: { hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching digital twin:', error);
      throw error;
    }
  },

  /**
   * Run space optimization simulation
   * @param {Object} simulationParams - Simulation parameters
   * @returns {Promise} - Promise with simulation results
   */
  runSpaceOptimization: async (simulationParams) => {
    try {
      const response = await axios.post(`${API_URL}/hotel-twin/space-optimization`, simulationParams);
      return response.data;
    } catch (error) {
      console.error('Error running space optimization:', error);
      throw error;
    }
  }
};

/**
 * Dashboard Data API Service
 */
export const DashboardDataService = {
  /**
   * Get main dashboard KPIs
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with dashboard KPI data
   */
  getDashboardKPIs: async (hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/kpis`, {
        params: { hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard KPIs:', error);
      throw error;
    }
  },

  /**
   * Get dashboard charts data
   * @param {string} timeRange - Time range for data (day, week, month, quarter, year)
   * @param {string} hotelId - Hotel ID
   * @returns {Promise} - Promise with dashboard charts data
   */
  getDashboardCharts: async (timeRange = 'month', hotelId) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/charts`, {
        params: { timeRange, hotelId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      throw error;
    }
  }
};

export default {
  RevenuePulseDataService,
  GuestDNADataService,
  HotelTwinDataService,
  DashboardDataService
};
