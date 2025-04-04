/**
 * Authentication Context
 * 
 * This file provides the authentication context for the FifthKeys platform.
 * It manages user authentication state and provides authentication-related functions.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const user = localStorage.getItem('user');
      
      if (isAuthenticated === 'true' && user) {
        setCurrentUser(JSON.parse(user));
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      
      // In a real implementation, this would call an API endpoint
      // For now, we'll use a simple validation and mock login
      if (email === 'admin@fifthkeys.com' && password === 'password') {
        const user = {
          id: '1',
          name: 'Admin User',
          email: 'admin@fifthkeys.com',
          role: 'admin'
        };
        
        // Store authentication token or user info in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        setCurrentUser(user);
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (err) {
      setError('Failed to log in');
      console.error('Login error:', err);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  // Value object to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Restore the default export for the context object itself
export default AuthContext;
