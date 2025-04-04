/**
 * FifthKeys Platform - Backend Server Entry Point
 * This file handles server startup and database connection
 */

// Load environment variables
require('dotenv').config();

// Import dependencies
const mongoose = require('mongoose');
const http = require('http');
const app = require('./server');

// Set default port
const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
};

// Default MongoDB URI (can be overridden by environment variable)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fifthkeys';

// Connect to MongoDB
mongoose.connect(MONGO_URI, mongoOptions)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Start the server after successful database connection
    server.listen(PORT, () => {
      console.log(`FifthKeys server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Socket.io setup (if needed)
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  // Add other socket event handlers as needed
});

// Graceful shutdown function
const gracefulShutdown = (signal) => {
  console.log(`${signal} signal received. Closing HTTP server.`);
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException'); // Trigger graceful shutdown
}); 