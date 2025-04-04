import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, Card, CardContent, CardHeader } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to FifthKeys Platform
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Your comprehensive hotel management solution with AI-powered optimization
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="RevenuePulse™" />
            <CardContent>
              <Typography variant="body1" paragraph>
                AI-powered revenue optimization engine that maximizes your hotel's EBITDA by optimizing all revenue streams.
              </Typography>
              <Button variant="contained" color="primary" href="/revenue-pulse">
                Open RevenuePulse
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="GuestDNA™" />
            <CardContent>
              <Typography variant="body1" paragraph>
                Hyper-personalized guest experience platform that understands and anticipates guest needs.
              </Typography>
              <Button variant="contained" color="primary" href="/guest-dna">
                Open GuestDNA
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="HotelTwin™" />
            <CardContent>
              <Typography variant="body1" paragraph>
                AI-powered digital twin and visualization platform for operational optimization.
              </Typography>
              <Button variant="contained" color="primary" href="/hotel-twin">
                Open HotelTwin
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Key Performance Indicators" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Item>
                    <Typography variant="h4" color="primary">+15%</Typography>
                    <Typography variant="body2">RevPAR Improvement</Typography>
                  </Item>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Item>
                    <Typography variant="h4" color="primary">+25%</Typography>
                    <Typography variant="body2">Guest Satisfaction</Typography>
                  </Item>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Item>
                    <Typography variant="h4" color="primary">-20%</Typography>
                    <Typography variant="body2">Operating Costs</Typography>
                  </Item>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                Generate Revenue Report
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
                View Guest Insights
              </Button>
              <Button variant="outlined" fullWidth>
                Run Space Optimization
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
