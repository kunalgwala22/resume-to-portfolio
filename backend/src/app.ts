/// <reference path="./types/express.d.ts" />
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { globalRateLimit } from './middleware/rateLimit.middleware';
import { errorMiddleware } from './middleware/error.middleware';

// Routes imports
import authRoutes from './modules/auth/auth.routes';
import resumeRoutes from './modules/resume/resume.routes';
import portfolioRoutes from './modules/portfolio/portfolio.routes';
import aiRoutes from './modules/ai/ai.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import templatesRoutes from './modules/templates/templates.routes';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local preview images if needed
}));

// Cross-Origin Resource Sharing
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    // In development mode, allow all origins
    if (env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Payloads Parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Global Rate Limiting Counter
app.use(globalRateLimit);

// API Routes Registrations
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/templates', templatesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString() 
  });
});

// Graceful 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: { code: 'NOT_FOUND' }
  });
});

// Global Error Handler Middleware
app.use(errorMiddleware);

export default app;
