/**
 * Dashboard Visualization Integration
 * 
 * This file integrates the data visualization components with the data API services
 * to create functional dashboard visualizations for the FifthKeys platform.
 */

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { DataVisualizationDashboard } from '../components/visualization/DataVisualization';
import { 
  RevenuePulseDataService, 
  GuestDNADataService, 
  HotelTwinDataService,
  DashboardDataService 
} from '../services/DataApiService';
import { useAuth } from '../context/AuthContext';

/**
 * RevenuePulse Dashboard Visualization
 */
export const RevenuePulseDashboardVisualization = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [kpis, setKpis] = useState([]);
  const [charts, setCharts] = useState([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get hotel ID from current user
        const hotelId = currentUser?.hotelId || 'demo-hotel';
        
        // Fetch revenue trends
        const revenueTrends = await RevenuePulseDataService.getRevenueTrends(timeRange, hotelId);
        
        // Fetch occupancy forecast
        const occupancyForecast = await RevenuePulseDataService.getOccupancyForecast(timeRange, hotelId);
        
        // Fetch price optimization for standard room
        const priceOptimization = await RevenuePulseDataService.getPriceOptimization('standard', timeRange, hotelId);
        
        // Fetch market intelligence
        const marketIntelligence = await RevenuePulseDataService.getMarketIntelligence(timeRange, hotelId);
        
        // Set KPIs
        setKpis([
          {
            title: 'Total Revenue (MTD)',
            value: revenueTrends.summary.totalRevenue.toLocaleString('en-US'),
            trend: revenueTrends.summary.revenueTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(revenueTrends.summary.revenueTrend).toFixed(1)}% vs Last Month`,
            prefix: '$'
          },
          {
            title: 'RevPAR',
            value: revenueTrends.summary.revPAR.toLocaleString('en-US'),
            trend: revenueTrends.summary.revPARTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(revenueTrends.summary.revPARTrend).toFixed(1)}% vs Last Month`,
            prefix: '$'
          },
          {
            title: 'Occupancy Rate',
            value: occupancyForecast.summary.occupancyRate.toFixed(1),
            trend: occupancyForecast.summary.occupancyTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(occupancyForecast.summary.occupancyTrend).toFixed(1)}% vs Last Month`,
            suffix: '%'
          },
          {
            title: 'ADR',
            value: revenueTrends.summary.adr.toLocaleString('en-US'),
            trend: revenueTrends.summary.adrTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(revenueTrends.summary.adrTrend).toFixed(1)}% vs Last Month`,
            prefix: '$'
          }
        ]);
        
        // Set charts
        setCharts([
          {
            type: 'revenue',
            title: 'Revenue Breakdown',
            data: revenueTrends.data,
            size: { xs: 12, md: 8 }
          },
          {
            type: 'preferences',
            title: 'Distribution Channels',
            data: marketIntelligence.distributionChannels,
            size: { xs: 12, md: 4 }
          },
          {
            type: 'occupancy',
            title: 'Occupancy Forecast vs Actual',
            data: occupancyForecast.data,
            size: { xs: 12, md: 6 }
          },
          {
            type: 'price',
            title: 'Price Optimization Scenarios',
            data: priceOptimization.scenarios,
            size: { xs: 12, md: 6 }
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching RevenuePulse dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange, currentUser]);
  
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <DataVisualizationDashboard
      title="RevenuePulse™ Dashboard"
      kpis={kpis}
      charts={charts}
      timeRange={timeRange}
      onTimeRangeChange={handleTimeRangeChange}
    />
  );
};

/**
 * GuestDNA Dashboard Visualization
 */
export const GuestDNADashboardVisualization = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [kpis, setKpis] = useState([]);
  const [charts, setCharts] = useState([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get hotel ID from current user
        const hotelId = currentUser?.hotelId || 'demo-hotel';
        
        // Fetch guest sentiment
        const guestSentiment = await GuestDNADataService.getGuestSentiment(timeRange, hotelId);
        
        // Fetch guest preferences
        const guestPreferences = await GuestDNADataService.getGuestPreferences(hotelId);
        
        // Fetch AI interactions
        const aiInteractions = await GuestDNADataService.getAIInteractions(timeRange, hotelId);
        
        // Set KPIs
        setKpis([
          {
            title: 'Active Guests',
            value: guestSentiment.summary.activeGuests,
            trend: guestSentiment.summary.activeGuestsTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(guestSentiment.summary.activeGuestsTrend)} since yesterday`
          },
          {
            title: 'Average Sentiment',
            value: guestSentiment.summary.averageSentiment.toFixed(2),
            trend: guestSentiment.summary.sentimentTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(guestSentiment.summary.sentimentTrend).toFixed(2)} vs Last Month`
          },
          {
            title: 'AI Interactions (Today)',
            value: aiInteractions.summary.todayInteractions,
            trend: aiInteractions.summary.interactionsTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(aiInteractions.summary.interactionsTrend)}% vs Yesterday`
          },
          {
            title: 'Personalization Score',
            value: guestPreferences.summary.personalizationScore.toFixed(1),
            trend: guestPreferences.summary.personalizationTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(guestPreferences.summary.personalizationTrend).toFixed(1)}% vs Last Month`,
            suffix: '/10'
          }
        ]);
        
        // Set charts
        setCharts([
          {
            type: 'sentiment',
            title: 'Guest Sentiment Trend',
            data: guestSentiment.data,
            size: { xs: 12, md: 8 }
          },
          {
            type: 'preferences',
            title: 'Guest Preferences',
            data: guestPreferences.preferences,
            size: { xs: 12, md: 4 }
          },
          {
            type: 'revenue',
            title: 'AI Interactions by Channel',
            data: aiInteractions.byChannel,
            size: { xs: 12, md: 6 }
          },
          {
            type: 'occupancy',
            title: 'Guest Satisfaction by Category',
            data: guestSentiment.byCategory,
            size: { xs: 12, md: 6 }
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GuestDNA dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange, currentUser]);
  
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <DataVisualizationDashboard
      title="GuestDNA™ Dashboard"
      kpis={kpis}
      charts={charts}
      timeRange={timeRange}
      onTimeRangeChange={handleTimeRangeChange}
    />
  );
};

/**
 * HotelTwin Dashboard Visualization
 */
export const HotelTwinDashboardVisualization = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [kpis, setKpis] = useState([]);
  const [charts, setCharts] = useState([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get hotel ID from current user
        const hotelId = currentUser?.hotelId || 'demo-hotel';
        
        // Fetch space utilization
        const spaceUtilization = await HotelTwinDataService.getSpaceUtilization(timeRange, hotelId);
        
        // Fetch energy usage
        const energyUsage = await HotelTwinDataService.getEnergyUsage(timeRange, hotelId);
        
        // Fetch space heatmap for lobby
        const spaceHeatmap = await HotelTwinDataService.getSpaceHeatmap('lobby', hotelId);
        
        // Set KPIs
        setKpis([
          {
            title: 'Current Occupancy',
            value: spaceUtilization.summary.currentOccupancy.toFixed(1),
            trend: spaceUtilization.summary.occupancyTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(spaceUtilization.summary.occupancyTrend)}% vs Average`,
            suffix: '%'
          },
          {
            title: 'Energy Consumption',
            value: energyUsage.summary.currentConsumption.toLocaleString('en-US'),
            trend: energyUsage.summary.consumptionTrend < 0 ? 'up' : 'down',
            trendValue: `${Math.abs(energyUsage.summary.consumptionTrend)}% vs Yesterday`,
            suffix: ' kWh'
          },
          {
            title: 'Active IoT Sensors',
            value: spaceUtilization.summary.activeSensors,
            trend: 'up',
            trendValue: 'All systems operational'
          },
          {
            title: 'Space Efficiency',
            value: spaceUtilization.summary.spaceEfficiency.toFixed(1),
            trend: spaceUtilization.summary.efficiencyTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(spaceUtilization.summary.efficiencyTrend)}% vs Target`,
            suffix: '%'
          }
        ]);
        
        // Set charts
        setCharts([
          {
            type: 'space',
            title: 'Space Utilization',
            data: spaceUtilization.bySpace,
            size: { xs: 12, md: 8 }
          },
          {
            type: 'preferences',
            title: 'Space Allocation',
            data: spaceUtilization.allocation,
            size: { xs: 12, md: 4 }
          },
          {
            type: 'energy',
            title: 'Energy Consumption (24 Hours)',
            data: energyUsage.hourly,
            size: { xs: 12, md: 6 }
          },
          {
            type: 'heatmap',
            title: 'Lobby Traffic Heatmap',
            data: spaceHeatmap.heatmapData,
            size: { xs: 12, md: 6 }
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching HotelTwin dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange, currentUser]);
  
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <DataVisualizationDashboard
      title="HotelTwin™ Dashboard"
      kpis={kpis}
      charts={charts}
      timeRange={timeRange}
      onTimeRangeChange={handleTimeRangeChange}
    />
  );
};

/**
 * Main Dashboard Visualization
 */
export const MainDashboardVisualization = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [kpis, setKpis] = useState([]);
  const [charts, setCharts] = useState([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get hotel ID from current user
        const hotelId = currentUser?.hotelId || 'demo-hotel';
        
        // Fetch dashboard KPIs
        const dashboardKPIs = await DashboardDataService.getDashboardKPIs(hotelId);
        
        // Fetch dashboard charts
        const dashboardCharts = await DashboardDataService.getDashboardCharts(timeRange, hotelId);
        
        // Set KPIs
        setKpis([
          {
            title: 'Total Revenue',
            value: dashboardKPIs.totalRevenue.toLocaleString('en-US'),
            trend: dashboardKPIs.revenueTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(dashboardKPIs.revenueTrend).toFixed(1)}% vs Last Month`,
            prefix: '$'
          },
          {
            title: 'Guest Satisfaction',
            value: dashboardKPIs.guestSatisfaction.toFixed(1),
            trend: dashboardKPIs.satisfactionTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(dashboardKPIs.satisfactionTrend).toFixed(1)}% vs Last Month`,
            suffix: '/10'
          },
          {
            title: 'Occupancy Rate',
            value: dashboardKPIs.occupancyRate.toFixed(1),
            trend: dashboardKPIs.occupancyTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(dashboardKPIs.occupancyTrend).toFixed(1)}% vs Last Month`,
            suffix: '%'
          },
          {
            title: 'Energy Efficiency',
            value: dashboardKPIs.energyEfficiency.toFixed(1),
            trend: dashboardKPIs.energyTrend > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(dashboardKPIs.energyTrend).toFixed(1)}% vs Last Month`,
            suffix: '%'
          }
        ]);
        
        // Set charts
        setCharts([
          {
            type: 'revenue',
            title: 'Revenue Performance',
            data: dashboardCharts.revenuePerformance,
            size: { xs: 12, md: 6 }
          },
          {
            type: 'sentiment',
            title: 'Guest Sentiment Trend',
            data: dashboardCharts.guestSentiment,
            size: { xs: 12, md: 6 }
          },
          {
            type: 'space',
            title: 'Space Utilization',
            data: dashboardCharts.spaceUtilization,
            size: { xs: 12, md: 6 }
          },
          {
            type: 'energy',
            title: 'Energy Consumption',
            data: dashboardCharts.energyConsumption,
            size: { xs: 12, md: 6 }
          }
        ]);
        
        setLoading(
(Content truncated due to size limit. Use line ranges to read in chunks)