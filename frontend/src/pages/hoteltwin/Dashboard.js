import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Button, TextField, InputAdornment, Tab, Tabs, Slider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

// Sample data for charts
const occupancyData = [
  { name: 'Lobby', current: 65, capacity: 100 },
  { name: 'Restaurant', current: 48, capacity: 80 },
  { name: 'Meeting Room A', current: 25, capacity: 30 },
  { name: 'Meeting Room B', current: 12, capacity: 20 },
  { name: 'Pool', current: 35, capacity: 50 },
  { name: 'Spa', current: 18, capacity: 25 },
];

const energyData = [
  { name: '00:00', value: 120 },
  { name: '02:00', value: 100 },
  { name: '04:00', value: 80 },
  { name: '06:00', value: 110 },
  { name: '08:00', value: 180 },
  { name: '10:00', value: 210 },
  { name: '12:00', value: 240 },
  { name: '14:00', value: 230 },
  { name: '16:00', value: 220 },
  { name: '18:00', value: 250 },
  { name: '20:00', value: 200 },
  { name: '22:00', value: 150 },
];

const spaceUsageData = [
  { name: 'Guest Rooms', value: 45 },
  { name: 'F&B', value: 20 },
  { name: 'Meeting', value: 15 },
  { name: 'Recreation', value: 10 },
  { name: 'Back of House', value: 10 },
];

const HotelTwinDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        HotelTwin™ Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        AI-powered digital twin and visualization platform
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Space Utilization" />
        <Tab label="Energy Management" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Current Occupancy
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    72%
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    +5% vs Average
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Energy Consumption
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    1,245 kWh
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                    -8% vs Yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Active IoT Sensors
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    248
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    All systems operational
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="Space Utilization" />
                <CardContent sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={occupancyData}
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
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Space Allocation" />
                <CardContent sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spaceUsageData}
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
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Space Optimization Simulator" />
              <CardContent>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Space</InputLabel>
                  <Select
                    value="restaurant"
                    label="Select Space"
                  >
                    <MenuItem value="lobby">Lobby</MenuItem>
                    <MenuItem value="restaurant">Restaurant</MenuItem>
                    <MenuItem value="meetingA">Meeting Room A</MenuItem>
                    <MenuItem value="meetingB">Meeting Room B</MenuItem>
                    <MenuItem value="pool">Pool Area</MenuItem>
                    <MenuItem value="spa">Spa</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography gutterBottom>Capacity Adjustment</Typography>
                <Slider
                  defaultValue={80}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={50}
                  max={150}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom>Layout Efficiency</Typography>
                <Slider
                  defaultValue={70}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                  sx={{ mb: 3 }}
                />
                
                <Button variant="contained" color="primary" fullWidth>
                  Run Optimization Simulation
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Traffic Flow Analysis" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  AI-powered analysis of guest and staff movement patterns to optimize space layout and improve operational efficiency.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ViewInArIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Hotspots: Main entrance, elevator lobby, restaurant entrance
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ViewInArIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Bottlenecks: Front desk during peak check-in times, breakfast buffet area
                  </Typography>
                </Box>
                <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                  View Heatmap
                </Button>
                <Button variant="outlined">
                  Generate Recommendations
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Energy Consumption (24 Hours)" />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={energyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="kWh" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Energy Optimization" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  AI-powered recommendations for energy savings based on occupancy patterns, weather data, and historical usage.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ElectricBoltIcon sx={{ mr: 1 }} color="warning" />
                  <Typography variant="body2">
                    Potential savings: 15-20% by optimizing HVAC schedules
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ElectricBoltIcon sx={{ mr: 1 }} color="warning" />
                  <Typography variant="body2">
                    ROI: 6-8 months for lighting sensor upgrades
                  </Typography>
                </Box>
                <Button variant="contained" color="primary">
                  Generate Energy Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Sustainability Metrics" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Track and improve your hotel's environmental impact with real-time sustainability metrics.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Carbon Footprint Reduction
                  </Typography>
                  <LinearProgressWithLabel value={65} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Water Conservation
                  </Typography>
                  <LinearProgressWithLabel value={78} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Waste Reduction
                  </Typography>
                  <LinearProgressWithLabel value={42} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

// Helper component for progress bars
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <div style={{ 
          height: 10, 
          borderRadius: 5, 
          backgroundColor: '#e0e0e0',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            width: `${props.value}%`,
            borderRadius: 5,
            backgroundColor: '#4caf50',
            position: 'absolute',
            left: 0,
            top: 0
          }} />
        </div>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default HotelTwinDashboard;
