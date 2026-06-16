import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDocument extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  items: {
    documentId: string;
    fileName: string;
    printType: string;
    colorMode: string;
    paperSize: string;
    copies: number;
    binding: string;
    coverPage: boolean;
    pageCount: number;
    subtotal: number;
  }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  deliveryMode: 'delivery' | 'pickup';
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'processing' | 'printed' | 'shipped' | 'delivered';
  trackingUrl?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema({
  documentId: { type: String, required: true },
  fileName: { type: String, required: true },
  printType: { type: String, enum: ['single', 'double'], required: true },
  colorMode: { type: String, enum: ['bw', 'color'], required: true },
  paperSize: { type: String, enum: ['A4', 'A3', 'Letter'], required: true },
  copies: { type: Number, required: true, min: 1 },
  binding: { type: String, enum: ['none', 'staple', 'spiral'], required: true },
  coverPage: { type: Boolean, default: false },
  pageCount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
}, { _id: false });

const orderSchema = new Schema<OrderDocument>({
  orderId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String,
  },
  deliveryMode: { type: String, enum: ['delivery', 'pickup'], required: true },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'processing', 'printed', 'shipped', 'delivered'],
    default: 'placed',
  },
  trackingUrl: String,
  estimatedDelivery: Date,
}, {
  timestamps: true,
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ orderStatus: 1 });

export const Order = mongoose.model<OrderDocument>('Order', orderSchema);
