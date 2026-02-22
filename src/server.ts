import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import ordersRoutes from './routes/orders';
dotenv.config();

const app = express();

// Use Railway-provided PORT (required on Railway)
const port = Number(process.env.PORT) || 3001;

// Use the actual deployed frontend URL in production
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(helmet()); // good security headers

// CORS - be strict in production


const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://scanetoorder.vercel.app", // production frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // add auth header if needed
  credentials: true,
}));

// Handle OPTIONS preflight
app.options("*", cors());

// Log requests (dev only in production)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // better for production logs
}

app.use(express.json()); // parse JSON bodies

// Routes
app.use('/api/orders', ordersRoutes);

// Health check (good to keep)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AntiGravity API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all 404 handler (improves API experience)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler (last middleware)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err.stack || err);

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message || 'Something went wrong',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }), // hide stack in prod
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port} | Env: ${process.env.NODE_ENV || 'development'}`);
});