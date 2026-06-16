import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/payment';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/create-order', authenticate, asyncHandler(createPaymentOrder));
router.post('/verify', authenticate, asyncHandler(verifyPayment));

export default router;
