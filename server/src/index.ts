import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import portfolioRoutes from './routes/portfolioRoutes';
import assetRoutes from './routes/assetRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} — ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Quantis Wealth API',
  });
});

// API Routes
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing connections...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   Quantis Wealth API                             ║
║   Running on http://localhost:${port}               ║
║   Environment: ${process.env.NODE_ENV || 'development'}                  ║
╚══════════════════════════════════════════════════╝
  `);
});
