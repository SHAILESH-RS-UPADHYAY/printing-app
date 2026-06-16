import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { AppError } from '../middleware/errorHandler';
import { generateOrderId, calculateDeliveryCharge } from '../utils/helpers';

export async function createOrder(req: Request, res: Response): Promise<void> {
  const { items, deliveryAddress, deliveryMode, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    throw new AppError('Order must have at least one item', 400);
  }

  const subtotal = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
  const deliveryCharge = deliveryMode === 'pickup' ? 0 : calculateDeliveryCharge(subtotal);
  const total = subtotal + deliveryCharge;

  const order = new Order({
    orderId: generateOrderId(),
    userId: req.user!.userId,
    items,
    deliveryAddress,
    deliveryMode,
    subtotal,
    deliveryCharge,
    discount: 0,
    total,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'placed',
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  });

  await order.save();

  res.status(201).json({
    order: {
      id: order._id,
      orderId: order.orderId,
      total: order.total,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    },
  });
}

export async function getUserOrders(req: Request, res: Response): Promise<void> {
  const { status } = req.query;
  const filter: any = { userId: req.user!.userId };

  if (status && status !== 'all') {
    filter.orderStatus = status;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ orders });
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  const order = await Order.findOne({
    _id: req.params.orderId,
    userId: req.user!.userId,
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({ order });
}

export async function getAllOrders(req: Request, res: Response): Promise<void> {
  const { status, page = '1', limit = '20' } = req.query;
  const filter: any = {};

  if (status && status !== 'all') {
    filter.orderStatus = status;
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit as string))
    .populate('userId', 'name phone');

  res.json({
    orders,
    pagination: {
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string)),
    },
  });
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  const { orderStatus, trackingUrl } = req.body;

  const validStatuses = ['placed', 'processing', 'printed', 'shipped', 'delivered'];
  if (!validStatuses.includes(orderStatus)) {
    throw new AppError('Invalid order status', 400);
  }

  const update: any = { orderStatus };
  if (trackingUrl) update.trackingUrl = trackingUrl;

  const order = await Order.findByIdAndUpdate(req.params.orderId, update, { new: true });
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({ order });
}
