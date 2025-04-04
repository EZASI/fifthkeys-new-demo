/**
 * Data Visualization Service
 * 
 * This file contains the implementation of data visualization components
 * for the FifthKeys platform.
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ComposedChart, Cell
} from 'recharts';
import { Box, Typography, Paper, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

/**
 * Revenue Trend Chart Component
 * Displays revenue trends over time with multiple revenue streams
 */
export const RevenueTrendChart = ({ data, height = 400 }) => {
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="totalRevenue" fill="#8884d8" stroke="#8884d8" name="Total Revenue" />
          <Bar dataKey="roomRevenue" stackId="a" fill="#8884d8" name="Room Revenue" />
          <Bar dataKey="fbRevenue" stackId="a" fill="#82ca9d" name="F&B Revenue" />
          <Bar dataKey="spaRevenue" stackId="a" fill="#ffc658" name="Spa Revenue" />
          <Bar dataKey="otherRevenue" stackId="a" fill="#ff8042" name="Other Revenue" />
          <Line type="monotone" dataKey="revPAR" stroke="#ff7300" name="RevPAR" yAxisId={1} />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

/**
 * Occupancy Forecast Chart Component
 * Displays occupancy forecast vs actual
 */
export const OccupancyForecastChart = ({ data, height = 400 }) => {
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Occupancy %" />
          <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast Occupancy %" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

/**
 * Price Optimization Chart Component
 * Displays price optimization scenarios
 */
export const PriceOptimizationChart = ({ data, height = 400 }) => {
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
          <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
          <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#ffc658" name="Occupancy %" />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

/**
 * Guest Sentiment Chart Component
 * Displays guest sentiment trends over time
 */
export const GuestSentimentChart = ({ data, height = 400 }) => {
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sentiment" stroke="#8884d8" name="Sentiment Score" />
          <Line type="monotone" dataKey="positive" stroke="#82ca9d" name="Positive" />
          <Line type="monotone" dataKey="negative" stroke="#ff8042" name="Negative" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

/**
 * Guest Preferences Chart Component
 * Displays guest preferences by category
 */
export const GuestPreferencesChart = ({ data, height = 400 }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

/**
 * Space Utilization Chart Component
 * Displays space utilization by area
 */
export const SpaceUtilizationChart = ({ data, height = 400 }) => {
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="current" fill="#8884d8" name="Current Occupancy" />
          <Bar dataKey="capacity" fill="#82ca9d" name="Total Capacity" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

/**
 * Energy Usage Chart Component
 * Displays energy usage over time
 */
export const EnergyUsageChart = ({ data, height = 400 }) => {
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" name="kWh" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

/**
 * Space Heatmap Component
 * Displays a heatmap of space utilization
 */
export const SpaceHeatmap = ({ data, width = 500, height = 400 }) => {
  // This is a simplified version - in a real implementation, 
  // this would use a more sophisticated heatmap library
  
  const maxValue = Math.max(...data.flat());
  
  return (
    <Box sx={{ width, height, position: 'relative' }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${data[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${data.length}, 1fr)`,
        width: '100%',
        height: '100%'
      }}>
        {data.flat().map((value, index) => {
          const intensity = value / maxValue;
          const row = Math.floor(index / data[0].length);
          const col = index % data[0].length;
          
          return (
            <div
              key={`cell-${row}-${col}`}
              style={{
                backgroundColor: `rgba(136, 132, 216, ${intensity})`,
                gridRow: row + 1,
                gridColumn: col + 1
              }}
            />
          );
        })}
      </div>
      <Box sx={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ mr: 1 }}>Low</Typography>
        <div style={{ 
          width: 100, 
          height: 10, 
          background: 'linear-gradient(to right, rgba(136, 132, 216, 0), rgba(136, 132, 216, 1))' 
        }} />
        <Typography variant="caption" sx={{ ml: 1 }}>High</Typography>
      </Box>
    </Box>
  );
};

/**
 * Dashboard KPI Component
 * Displays a key performance indicator with value and trend
 */
export const DashboardKPI = ({ title, value, trend, trendValue, prefix = '', suffix = '' }) => {
  const isPositive = trend === 'up';
  
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" sx={{ mb: 1 }}>
        {prefix}{value}{suffix}
      </Typography>
      <Typography 
        variant="body2" 
        color={isPositive ? 'success.main' : 'error.main'} 
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {isPositive ? '↑' : '↓'} {trendValue}
      </Typography>
    </Paper>
  );
};

/**
 * Data Visualization Dashboard Component
 * A configurable dashboard for data visualization
 */
export const DataVisualizationDashboard = ({ 
  title, 
  kpis = [], 
  charts = [],
  timeRange = 'month',
  onTimeRangeChange
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={timeRange}
            label="Time Range"
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* KPIs Row */}
      {kpis.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {kpis.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={`kpi-${index}`}>
              <DashboardKPI {...kpi} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Charts */}
      <Grid container spacing={3}>
        {charts.map((chart, index) => {
          const { type, data, title, size = { xs: 12, md: 6 } } = chart;
          
          let ChartComponent;
          switch (type) {
            case 'revenue':
              ChartComponent = <RevenueTrendChart data={data} />;
              break;
            case 'occupancy':
              ChartComponent = <OccupancyForecastChart data={data} />;
              break;
            case 'price':
              ChartComponent = <PriceOptimizationChart data={data} />;
              break;
            case 'sentiment':
              ChartComponent = <GuestSentimentChart data={data} />;
              break;
            case 'preferences':
              ChartComponent = <GuestPreferencesChart data={data} />;
              break;
            case 'space':
              ChartComponent = <SpaceUtilizationChart data={data} />;
              break;
            case 'energy':
              ChartComponent = <EnergyUsageChart data={data} />;
              break;
            case 'heatmap':
              ChartComponent = <SpaceHeatmap data={data} />;
              break;
            default:
              ChartComponent = <Typography>Unsupported chart type</Typography>;
          }
          
          return (
            <Grid item {...size} key={`chart-${index}`}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                {ChartComponent}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default {
  RevenueTrendChart,
  OccupancyForecastChart,
  PriceOptimizationChart,
  GuestSentimentChart,
  GuestPreferencesChart,
  SpaceUtilizationChart,
  EnergyUsageChart,
  SpaceHeatmap,
  DashboardKPI,
  DataVisualizationDashboard
};
