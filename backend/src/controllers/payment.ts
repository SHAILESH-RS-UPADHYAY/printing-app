import { Request, Response } from 'express';
import crypto from 'crypto';
import { razorpay } from '../config/razorpay';
import { Order } from '../models/Order';
import { AppError } from '../middleware/errorHandler';

export async function createPaymentOrder(req: Request, res: Response): Promise<void> {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, userId: req.user!.userId });
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const amountInPaise = Math.round(order.total * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: order.orderId,
    notes: {
      userId: req.user!.userId,
      orderId: order._id.toString(),
    },
  });

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    order: {
      id: order._id,
      orderId: order.orderId,
      total: order.total,
    },
  });
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new AppError('Payment verification failed', 400);
  }

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: 'paid',
    paymentId: razorpay_payment_id,
    orderStatus: 'placed',
  });

  res.json({ success: true, message: 'Payment verified successfully' });
}
