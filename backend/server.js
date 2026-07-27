import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import initCronJobs from './jobs/reminderJob.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize scheduler for reminders and recurring jobs
initCronJobs();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  \x1b[35m=========================================================\x1b[0m
  \x1b[36m  GoalFlow - Smart Daily Goal Tracker Backend running\x1b[0m
  \x1b[32m  Port: ${PORT} | Environment: ${process.env.NODE_ENV || 'development'}\x1b[0m
  \x1b[35m=========================================================\x1b[0m
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`\x1b[31m[Process Alert] Unhandled Rejection: ${err.message}\x1b[0m`);
  // Gracefully close server & exit process
  server.close(() => process.exit(1));
});

// Graceful Shutdown
const shutDownGracefully = async (signal) => {
  console.log(`\x1b[33m\n[Process Alert] ${signal} signal received. Starting graceful shutdown...\x1b[0m`);
  
  server.close(async () => {
    console.log('[Process Status] Express server closed.');
    try {
      await mongoose.connection.close();
      console.log('[Process Status] MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error(`[Process Status] Error closing MongoDB connection: ${err.message}`);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutDownGracefully('SIGTERM'));
process.on('SIGINT', () => shutDownGracefully('SIGINT'));
