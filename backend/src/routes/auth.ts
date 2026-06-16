import { Router } from 'express';
import { sendOtp, verifyOtp, getProfile, updateProfile, addAddress, deleteAddress, adminLogin, getAllUsers } from '../controllers/auth';
import { authenticate, adminOnly } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/send-otp', asyncHandler(sendOtp));
router.post('/verify-otp', asyncHandler(verifyOtp));
router.post('/admin-login', asyncHandler(adminLogin));
router.get('/profile', authenticate, asyncHandler(getProfile));
router.put('/profile', authenticate, asyncHandler(updateProfile));
router.post('/address', authenticate, asyncHandler(addAddress));
router.delete('/address/:addressId', authenticate, asyncHandler(deleteAddress));
router.get('/users', authenticate, adminOnly, asyncHandler(getAllUsers));

export default router;
