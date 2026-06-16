export interface IUser {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  addresses: IAddress[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface IDocument {
  _id?: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  mimeType: string;
  pageCount: number;
  createdAt?: Date;
}

export interface IOrder {
  _id?: string;
  orderId: string;
  userId: string;
  items: IOrderItem[];
  deliveryAddress: IAddress;
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
  createdAt?: Date;
  estimatedDelivery?: Date;
}

export interface IOrderItem {
  documentId: string;
  fileName: string;
  printType: 'single' | 'double';
  colorMode: 'bw' | 'color';
  paperSize: 'A4' | 'A3' | 'Letter';
  copies: number;
  binding: 'none' | 'staple' | 'spiral';
  coverPage: boolean;
  pageCount: number;
  subtotal: number;
}

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  category: 'planner' | 'diary' | 'notebook' | 'poster';
  price: number;
  images: string[];
  inStock: boolean;
  createdAt?: Date;
}

export interface JwtPayload {
  userId: string;
  phone: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
