import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description: string;
  category: 'planner' | 'diary' | 'notebook' | 'poster';
  price: number;
  images: string[];
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['planner', 'diary', 'notebook', 'poster'],
    required: true,
  },
  price: { type: Number, required: true },
  images: [String],
  inStock: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Product = mongoose.model<ProductDocument>('Product', productSchema);
