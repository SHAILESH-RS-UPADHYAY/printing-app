import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product';
import { authenticate, adminOnly } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getProducts));
router.get('/:productId', asyncHandler(getProductById));
router.post('/', authenticate, adminOnly, asyncHandler(createProduct));
router.put('/:productId', authenticate, adminOnly, asyncHandler(updateProduct));
router.delete('/:productId', authenticate, adminOnly, asyncHandler(deleteProduct));

export default router;
