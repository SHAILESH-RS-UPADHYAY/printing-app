import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  phone: string;
  email?: string;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  role: 'user' | 'admin';
  addresses: {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema({
  id: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: String,
  isDefault: { type: Boolean, default: false },
}, { _id: false });

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  otp: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: [addressSchema],
}, {
  timestamps: true,
});

export const User = mongoose.model<UserDocument>('User', userSchema);
