import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Button, TextField, InputAdornment, Tab, Tabs, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Chip } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';

// Sample data for charts
const sentimentData = [
  { name: 'Jan', score: 0.65 },
  { name: 'Feb', score: 0.68 },
  { name: 'Mar', score: 0.72 },
  { name: 'Apr', score: 0.75 },
  { name: 'May', score: 0.82 },
  { name: 'Jun', score: 0.85 },
];

const interactionData = [
  { name: 'Jan', chat: 450, email: 230, voice: 120 },
  { name: 'Feb', chat: 480, email: 220, voice: 130 },
  { name: 'Mar', chat: 520, email: 240, voice: 150 },
  { name: 'Apr', chat: 550, email: 250, voice: 160 },
  { name: 'May', chat: 600, email: 270, voice: 180 },
  { name: 'Jun', chat: 650, email: 290, voice: 200 },
];

const preferenceData = [
  { name: 'Room Type', value: 35 },
  { name: 'Amenities', value: 25 },
  { name: 'F&B', value: 20 },
  { name: 'Activities', value: 15 },
  { name: 'Other', value: 5 },
];

// Sample guest data
const recentGuests = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', status: 'checked-in', sentiment: 0.85, tags: ['business', 'repeat', 'vip'] },
  { id: 2, name: 'Emma Johnson', email: 'emma.j@example.com', status: 'reserved', sentiment: 0.72, tags: ['family', 'first-time'] },
  { id: 3, name: 'Michael Brown', email: 'm.brown@example.com', status: 'checked-out', sentiment: 0.65, tags: ['business', 'repeat'] },
  { id: 4, name: 'Sophia Williams', email: 'sophia.w@example.com', status: 'checked-in', sentiment: 0.92, tags: ['leisure', 'vip'] },
];

const GuestDNADashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showConciergeDialog, setShowConciergeDialog] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewAnalytics = () => {
    // Navigate to the analytics page
    navigate('/guest-dna/analytics');
    console.log('Navigating to conversation analytics');
  };

  const handleTestConcierge = () => {
    // In a real app, this might open a chat dialog or navigate to a testing page
    // For now, we'll just log the action
    console.log('Opening AI Concierge test interface');
    
    // Navigate to the AI Concierge Dashboard
    navigate('/guest-dna/concierge');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        GuestDNA™ Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Hyper-personalized guest experience platform
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Guest Profiles" />
        <Tab label="AI Concierge" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Active Guests
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    127
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    +12 since yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Average Sentiment
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    0.82
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    +0.05 vs Last Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    AI Interactions (Today)
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    342
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    +18% vs Yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="Guest Sentiment Trend" />
                <CardContent sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={sentimentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" name="Sentiment Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Guest Preferences" />
                <CardContent sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={preferenceData}
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
              <CardHeader 
                title="Recent Guests" 
                action={
                  <Button variant="contained" color="primary">
                    Add New Guest
                  </Button>
                }
              />
              <CardContent>
                <List>
                  {recentGuests.map((guest) => (
                    <React.Fragment key={guest.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>{guest.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={guest.name}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {guest.email}
                              </Typography>
                              {` — Status: ${guest.status}`}
                            </>
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {guest.sentiment > 0.7 ? (
                              <SentimentSatisfiedAltIcon color="success" sx={{ mr: 1 }} />
                            ) : (
                              <SentimentVeryDissatisfiedIcon color="warning" sx={{ mr: 1 }} />
                            )}
                            <Typography variant="body2">
                              Sentiment: {guest.sentiment.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box>
                            {guest.tags.map((tag) => (
                              <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                            ))}
                          </Box>
                        </Box>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="AI Interactions by Channel" />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={interactionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="chat" fill="#8884d8" name="Chat" />
                    <Bar dataKey="email" fill="#82ca9d" name="Email" />
                    <Bar dataKey="voice" fill="#ffc658" name="Voice" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="AI Concierge" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  The AI Concierge provides personalized assistance to guests through natural language interactions.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ChatIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Most common requests: Room service, local recommendations, housekeeping
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mb: 2, mr: 2 }} 
                  onClick={handleViewAnalytics}
                >
                  View Conversation Analytics
                </Button>
                <Button 
                  variant="outlined"
                  onClick={handleTestConcierge}
                >
                  Test AI Concierge
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default GuestDNADashboard;
