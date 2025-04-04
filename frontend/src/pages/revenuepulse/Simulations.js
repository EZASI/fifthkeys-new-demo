import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';

const roomTypes = ['Standard King', 'Deluxe Queen', 'Executive Suite'];
const demandScenarios = ['Low', 'Medium', 'High', 'Event'];

function Simulations() {
  const [roomType, setRoomType] = useState(roomTypes[0]);
  const [dateRangeStart, setDateRangeStart] = useState('2024-06-01');
  const [dateRangeEnd, setDateRangeEnd] = useState('2024-06-07');
  const [priceAdjustment, setPriceAdjustment] = useState(0); // Percentage adjustment
  const [demandScenario, setDemandScenario] = useState(demandScenarios[1]);
  const [simulationResult, setSimulationResult] = useState(null);

  const handleRunSimulation = () => {
    // In a real app, this would likely call a backend API
    // For now, generate mock results based somewhat on inputs
    console.log('Running simulation with:', {
      roomType,
      dateRangeStart,
      dateRangeEnd,
      priceAdjustment,
      demandScenario,
    });

    let baseOccupancy = 70;
    let baseAdr = 180;

    if (demandScenario === 'High' || demandScenario === 'Event') baseOccupancy += 15;
    if (demandScenario === 'Low') baseOccupancy -= 20;
    if (demandScenario === 'Event') baseAdr += 50;

    let adjustedAdr = baseAdr * (1 + priceAdjustment / 100);
    
    // Simple model: higher price slightly reduces occupancy, lower price slightly increases it
    let adjustedOccupancy = baseOccupancy - (priceAdjustment * 0.3);
    adjustedOccupancy = Math.max(20, Math.min(98, adjustedOccupancy)); // Clamp occupancy

    const projectedRevPAR = adjustedAdr * (adjustedOccupancy / 100);
    // Assuming 100 rooms of this type for total revenue calculation
    const projectedRevenue = projectedRevPAR * 100 * 7; // 7 days in range

    setSimulationResult({
      occupancy: adjustedOccupancy.toFixed(1),
      revpar: projectedRevPAR.toFixed(2),
      revenue: projectedRevenue.toFixed(2),
      notes: `Based on ${demandScenario} demand and a ${priceAdjustment}% price adjustment for ${roomType}.`
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Revenue Simulation Lab
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Run "What-If" scenarios to predict the impact of pricing and demand changes.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Simulation Inputs Card */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardHeader title="Simulation Parameters" />
            <CardContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={roomType}
                  label="Room Type"
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  {roomTypes.map((rt) => (
                    <MenuItem key={rt} value={rt}>{rt}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Start Date"
                type="date"
                fullWidth
                margin="normal"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                margin="normal"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <Typography gutterBottom sx={{ mt: 2 }}>
                Price Adjustment (%): {priceAdjustment}%
              </Typography>
              <Slider
                value={priceAdjustment}
                onChange={(e, newValue) => setPriceAdjustment(newValue)}
                aria-labelledby="price-adjustment-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={-50}
                max={50}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Demand Scenario</InputLabel>
                <Select
                  value={demandScenario}
                  label="Demand Scenario"
                  onChange={(e) => setDemandScenario(e.target.value)}
                >
                  {demandScenarios.map((ds) => (
                    <MenuItem key={ds} value={ds}>{ds}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={handleRunSimulation}
              >
                Run Simulation
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Simulation Results Card */}
        <Grid item xs={12} md={7}>
          <Card sx={{ minHeight: '100%' }}>
            <CardHeader title="Simulation Results" />
            <CardContent>
              {simulationResult ? (
                <Box>
                  <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="h6">Projected Occupancy:</Typography>
                    <Typography variant="h4" color="primary">{simulationResult.occupancy}%</Typography>
                  </Paper>
                  <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e9' }}>
                    <Typography variant="h6">Projected RevPAR:</Typography>
                    <Typography variant="h4" color="primary">${simulationResult.revpar}</Typography>
                  </Paper>
                  <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0' }}>
                    <Typography variant="h6">Projected Total Revenue:</Typography>
                    <Typography variant="h4" color="primary">${simulationResult.revenue}</Typography>
                  </Paper>
                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                    {simulationResult.notes}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Adjust parameters and click "Run Simulation" to see projected results.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Simulations; 