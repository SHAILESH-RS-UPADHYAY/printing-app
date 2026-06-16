import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

export async function getProducts(req: Request, res: Response): Promise<void> {
  const { category } = req.query;
  const filter: any = { inStock: true };

  if (category && category !== 'all') {
    filter.category = category;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ products });
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ product });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ product });
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ message: 'Product deleted' });
}
