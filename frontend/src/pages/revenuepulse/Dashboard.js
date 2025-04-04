import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Button, TextField, InputAdornment, Tab, Tabs } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

// Sample data for charts
const revenueData = [
  { name: 'Jan', rooms: 4000, fb: 2400, spa: 1200, other: 800 },
  { name: 'Feb', rooms: 4200, fb: 2100, spa: 1100, other: 900 },
  { name: 'Mar', rooms: 5000, fb: 2800, spa: 1300, other: 1000 },
  { name: 'Apr', rooms: 5500, fb: 3000, spa: 1400, other: 1100 },
  { name: 'May', rooms: 6000, fb: 3200, spa: 1500, other: 1200 },
  { name: 'Jun', rooms: 6500, fb: 3500, spa: 1600, other: 1300 },
];

const occupancyData = [
  { name: 'Jan', actual: 65, forecast: 60 },
  { name: 'Feb', actual: 68, forecast: 65 },
  { name: 'Mar', actual: 75, forecast: 70 },
  { name: 'Apr', actual: 80, forecast: 75 },
  { name: 'May', actual: 85, forecast: 80 },
  { name: 'Jun', actual: 90, forecast: 85 },
];

const channelData = [
  { name: 'Direct', value: 35 },
  { name: 'OTA', value: 40 },
  { name: 'Corporate', value: 15 },
  { name: 'Wholesale', value: 10 },
];

const RevenuePulseDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        RevenuePulse™ Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        AI-powered revenue optimization engine
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Revenue Analysis" />
        <Tab label="Pricing Strategy" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Revenue (MTD)
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    $1,245,678
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    +12.5% vs Last Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    RevPAR
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    $245.50
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    +8.3% vs Last Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Occupancy Rate
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    85.2%
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    +5.7% vs Last Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="Revenue Breakdown" />
                <CardContent sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rooms" stackId="a" fill="#8884d8" name="Room Revenue" />
                      <Bar dataKey="fb" stackId="a" fill="#82ca9d" name="F&B Revenue" />
                      <Bar dataKey="spa" stackId="a" fill="#ffc658" name="Spa Revenue" />
                      <Bar dataKey="other" stackId="a" fill="#ff8042" name="Other Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Distribution Channels" />
                <CardContent sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Revenue Trends" />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rooms" stroke="#8884d8" name="Room Revenue" />
                    <Line type="monotone" dataKey="fb" stroke="#82ca9d" name="F&B Revenue" />
                    <Line type="monotone" dataKey="spa" stroke="#ffc658" name="Spa Revenue" />
                    <Line type="monotone" dataKey="other" stroke="#ff8042" name="Other Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Occupancy Forecast vs Actual" />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={occupancyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Occupancy %" />
                    <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast Occupancy %" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Price Optimization" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  AI-recommended pricing strategies based on demand forecasts, competitor analysis, and market trends.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mb: 2 }} 
                  onClick={() => navigate('/revenue-pulse/pricing')}
                >
                  Generate Pricing Recommendations
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/revenue-pulse/simulations')}
                >
                  Run "What-If" Simulation
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RevenuePulseDashboard;
