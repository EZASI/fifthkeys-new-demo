import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button
} from '@mui/material';

// Mock data simulating AI recommendations
const mockRecommendations = [
  {
    id: 1,
    roomType: 'Standard King',
    dateRange: '2024-05-15 - 2024-05-17',
    currentPrice: 150,
    recommendedPrice: 165,
    demandLevel: 'High',
    competitorAvg: 170,
    reason: 'High local event demand, competitor pricing increase.'
  },
  {
    id: 2,
    roomType: 'Deluxe Queen',
    dateRange: '2024-05-18 - 2024-05-20',
    currentPrice: 180,
    recommendedPrice: 180,
    demandLevel: 'Medium',
    competitorAvg: 185,
    reason: 'Stable demand, current pricing competitive.'
  },
  {
    id: 3,
    roomType: 'Executive Suite',
    dateRange: '2024-05-15 - 2024-05-17',
    currentPrice: 250,
    recommendedPrice: 275,
    demandLevel: 'High',
    competitorAvg: 280,
    reason: 'High local event demand, limited suite availability.'
  },
  {
    id: 4,
    roomType: 'Standard King',
    dateRange: '2024-05-21 - 2024-05-23',
    currentPrice: 150,
    recommendedPrice: 140,
    demandLevel: 'Low',
    competitorAvg: 145,
    reason: 'Low seasonal demand predicted, encourage bookings.'
  },
];

function PricingRecommendations() {
  // eslint-disable-next-line no-unused-vars
  const [recommendations, setRecommendations] = useState(mockRecommendations);

  const getDemandChipColor = (demand) => {
    switch (demand) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  // Function to handle button click
  const handleApplyClick = (recommendation) => {
    console.log('Apply clicked for:', recommendation);
    // TODO: Add logic here to actually apply the recommendation
    // This might involve calling a backend API
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Pricing Recommendations
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Review and apply AI-suggested pricing strategies based on forecasts, competitor analysis, and market trends.
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="pricing recommendations table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Room Type</TableCell>
              <TableCell>Date Range</TableCell>
              <TableCell align="right">Current ($)</TableCell>
              <TableCell align="right">Recommended ($)</TableCell>
              <TableCell>Demand</TableCell>
              <TableCell align="right">Competitor Avg ($)</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recommendations.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.roomType}
                </TableCell>
                <TableCell>{row.dateRange}</TableCell>
                <TableCell align="right">{row.currentPrice.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {row.recommendedPrice.toFixed(2)}
                  {row.recommendedPrice > row.currentPrice ? ' ▲' : row.recommendedPrice < row.currentPrice ? ' ▼' : ''}
                </TableCell>
                <TableCell>
                  <Chip label={row.demandLevel} color={getDemandChipColor(row.demandLevel)} size="small" />
                </TableCell>
                <TableCell align="right">{row.competitorAvg.toFixed(2)}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{row.reason}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleApplyClick(row)}
                  >
                    Apply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PricingRecommendations; 