import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from './models/User';
import { Product } from './models/Product';

const PRODUCTS = [
  { name: 'Daily Planner 2026', description: 'Plan your day with our premium daily planner', category: 'planner', price: 149, inStock: true },
  { name: 'Weekly Planner', description: 'Weekly layout for better time management', category: 'planner', price: 129, inStock: true },
  { name: 'Hardbound Diary', description: 'Premium hardbound diary with 200 pages', category: 'diary', price: 199, inStock: true },
  { name: 'Spiral Notebook', description: 'College ruled spiral notebook, 100 pages', category: 'notebook', price: 89, inStock: true },
  { name: 'Motivational Poster', description: 'Inspirational quote poster, 12x18 inches', category: 'poster', price: 59, inStock: true },
  { name: 'Study Planner', description: 'Semester planner for students', category: 'planner', price: 99, inStock: true },
  { name: 'Premium Diary', description: 'Leather-bound premium diary, 300 pages', category: 'diary', price: 299, inStock: true },
  { name: 'A4 Notebook', description: 'A4 size notebook, 120 pages', category: 'notebook', price: 119, inStock: true },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@printclient.app';
  const existingAdmin = await User.findOne({ email: adminEmail });
  
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      phone: '9999999999',
      email: adminEmail,
      isVerified: true,
      role: 'admin',
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(PRODUCTS);
    console.log(`✅ ${PRODUCTS.length} products seeded`);
  } else {
    console.log(`ℹ️  ${productCount} products already exist, skipping seed`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
