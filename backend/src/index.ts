import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-tracker';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error);
    console.warn('Continuing without MongoDB — in-memory fallbacks will be used for testing.');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling middleware
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
);

// Start server with port fallback if the desired port is in use
const tryListen = (port: number) =>
  new Promise<{ port: number }>((resolve, reject) => {
    const server = app
      .listen(port)
      .once('listening', () => resolve({ port }))
      .once('error', (err: any) => reject(err));
  });

const start = async () => {
  const basePort = Number(PORT);
  const maxAttempts = 10;
  let currentPort = basePort;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await tryListen(currentPort);
      console.log(`🚀 Server running at http://localhost:${currentPort}`);
      if (currentPort !== basePort) {
        console.warn(`Port ${basePort} was in use — bound to ${currentPort} instead.`);
      }
      return;
    } catch (err: any) {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${currentPort} in use, trying ${currentPort + 1}...`);
        currentPort += 1;
        continue;
      }
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  }

  console.error(`No available ports found in range ${basePort}-${currentPort}`);
  process.exit(1);
};

start();
