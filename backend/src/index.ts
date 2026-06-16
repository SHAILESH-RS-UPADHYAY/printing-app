import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { configureCloudinary } from './config/cloudinary';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import orderRoutes from './routes/order';
import paymentRoutes from './routes/payment';
import productRoutes from './routes/product';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  configureCloudinary();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });
}

start();
