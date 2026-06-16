import { Router } from 'express';
import { uploadFile, uploadMultiple, getUserDocuments, deleteDocument } from '../controllers/upload';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/single', authenticate, upload.single('file'), asyncHandler(uploadFile));
router.post('/multiple', authenticate, upload.array('files', 10), asyncHandler(uploadMultiple));
router.get('/', authenticate, asyncHandler(getUserDocuments));
router.delete('/:documentId', authenticate, asyncHandler(deleteDocument));

export default router;
