import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

// Middleware imports
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// 1. Security Middlewares
app.use(helmet()); // Sets various HTTP headers for security
app.use(
  cors({
    origin: true, // Allow all origins for testing/development
    credentials: true, // Allow receiving cookies from frontends
  })
);
app.use(mongoSanitize()); // Prevent NoSQL query injection

// 2. Rate Limiting (IP-based limiters)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // default: 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 3. Parser & Utility Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// 4. API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Base route for quick API status check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GoalFlow API services are active and running.',
    timestamp: new Date(),
  });
});

// 5. Error & Fallback Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
