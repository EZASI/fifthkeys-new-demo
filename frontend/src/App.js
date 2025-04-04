import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout components
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// RevenuePulse pages
import RevenuePulseDashboard from './pages/revenuepulse/Dashboard';
import RevenueAnalytics from './pages/revenuepulse/Analytics';
import PricingRecommendations from './pages/revenuepulse/PricingRecommendations';
import MarketIntelligence from './pages/revenuepulse/MarketIntelligence';
import Simulations from './pages/revenuepulse/Simulations';

// GuestDNA pages
import GuestDNADashboard from './pages/guestdna/Dashboard';
import GuestProfiles from './pages/guestdna/GuestProfiles';
import GuestAnalytics from './pages/guestdna/Analytics';
import AIConciergeDashboard from './pages/guestdna/AIConciergeDashboard';
import Personalization from './pages/guestdna/Personalization';

// HotelTwin pages
import HotelTwinDashboard from './pages/hoteltwin/Dashboard';
import DigitalTwinViewer from './pages/hoteltwin/DigitalTwinViewer';
import SpaceAnalytics from './pages/hoteltwin/SpaceAnalytics';
import EnergyAnalytics from './pages/hoteltwin/EnergyAnalytics';
import SimulationLab from './pages/hoteltwin/SimulationLab';

// Settings and user management
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<Layout />}>
              {/* Main Dashboard */}
              <Route index element={<Dashboard />} />
              
              {/* RevenuePulse Module */}
              <Route path="revenue-pulse" element={<RevenuePulseDashboard />} />
              <Route path="revenue-pulse/analytics" element={<RevenueAnalytics />} />
              <Route path="revenue-pulse/pricing" element={<PricingRecommendations />} />
              <Route path="revenue-pulse/market" element={<MarketIntelligence />} />
              <Route path="revenue-pulse/simulations" element={<Simulations />} />
              
              {/* GuestDNA Module */}
              <Route path="guest-dna" element={<GuestDNADashboard />} />
              <Route path="guest-dna/profiles" element={<GuestProfiles />} />
              <Route path="guest-dna/analytics" element={<GuestAnalytics />} />
              <Route path="guest-dna/concierge" element={<AIConciergeDashboard />} />
              <Route path="guest-dna/personalization" element={<Personalization />} />
              
              {/* HotelTwin Module */}
              <Route path="hotel-twin" element={<HotelTwinDashboard />} />
              <Route path="hotel-twin/viewer" element={<DigitalTwinViewer />} />
              <Route path="hotel-twin/space-analytics" element={<SpaceAnalytics />} />
              <Route path="hotel-twin/energy-analytics" element={<EnergyAnalytics />} />
              <Route path="hotel-twin/simulation-lab" element={<SimulationLab />} />
              
              {/* Settings and User Management */}
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            
            {/* Redirect to login if not found */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
