import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

function generateToken(userId: string, phone: string, role: string): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  };
  return jwt.sign(
    { userId, phone, role },
    process.env.JWT_SECRET || 'secret',
    options
  );
}

export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { phone } = req.body;

  if (!phone || phone.length !== 10) {
    throw new AppError('Valid 10-digit phone number is required', 400);
  }

  const otp = '1234';
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ name: 'User', phone, otp, otpExpiry });
  } else {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
  }
  await user.save();

  console.log(`📱 OTP for ${phone}: ${otp}`);

  res.json({
    message: 'OTP sent successfully',
    phone,
    ...(process.env.NODE_ENV === 'development' && { otp }),
  });
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { phone, otp, name } = req.body;

  if (!phone || !otp) {
    throw new AppError('Phone and OTP are required', 400);
  }

  const user = await User.findOne({ phone });
  if (!user) {
    throw new AppError('User not found. Send OTP first.', 404);
  }

  if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  if (name) user.name = name;
  await user.save();

  const token = generateToken(user._id.toString(), user.phone, user.role);

  res.json({
    message: 'OTP verified successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    },
  });
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!.userId).select('-otp -otpExpiry');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ user });
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user!.userId,
    { ...(name && { name }), ...(email && { email }) },
    { new: true }
  ).select('-otp -otpExpiry');

  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ user });
}

export async function addAddress(req: Request, res: Response): Promise<void> {
  const address = {
    id: Date.now().toString(),
    ...req.body,
    isDefault: req.body.isDefault || false,
  };

  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError('User not found', 404);

  if (address.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses.push(address);
  await user.save();

  res.status(201).json({ address });
}

export async function deleteAddress(req: Request, res: Response): Promise<void> {
  const { addressId } = req.params;
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError('User not found', 404);

  user.addresses = user.addresses.filter((a) => a.id !== addressId);
  await user.save();

  res.json({ message: 'Address deleted' });
}

export async function adminLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    throw new AppError('Invalid credentials', 401);
  }

  const adminUser = await User.findOne({ email, role: 'admin' });
  if (!adminUser) {
    throw new AppError('Admin user not found', 404);
  }

  const token = generateToken(adminUser._id.toString(), adminUser.phone, 'admin');

  res.json({
    token,
    user: {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    },
  });
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await User.find({}).select('-otp -otpExpiry').sort({ createdAt: -1 });
  res.json({ users });
}
