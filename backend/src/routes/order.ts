import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/order';
import { authenticate, adminOnly } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticate, asyncHandler(createOrder));
router.get('/', authenticate, asyncHandler(getUserOrders));
router.get('/all', authenticate, adminOnly, asyncHandler(getAllOrders));
router.get('/:orderId', authenticate, asyncHandler(getOrderById));
router.put('/:orderId/status', authenticate, adminOnly, asyncHandler(updateOrderStatus));

export default router;
