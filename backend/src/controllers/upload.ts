import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary';
import { PrintDocument } from '../models/Document';
import { AppError } from '../middleware/errorHandler';
import { estimatePageCount } from '../utils/helpers';

export async function uploadFile(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    throw new AppError('No file provided', 400);
  }

  const file = req.file;
  const pageCount = estimatePageCount(file.mimetype, file.size);

  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'print-client/documents',
        public_id: `${Date.now()}-${file.originalname}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });

  const document = new PrintDocument({
    userId: req.user!.userId,
    fileName: file.originalname,
    fileUrl: result.secure_url,
    publicId: result.public_id,
    fileSize: file.size,
    mimeType: file.mimetype,
    pageCount,
  });

  await document.save();

  res.status(201).json({
    document: {
      id: document._id,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      pageCount: document.pageCount,
    },
  });
}

export async function uploadMultiple(req: Request, res: Response): Promise<void> {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError('No files provided', 400);
  }

  const files = req.files as Express.Multer.File[];
  const documents = [];

  for (const file of files) {
    const pageCount = estimatePageCount(file.mimetype, file.size);
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'print-client/documents',
          public_id: `${Date.now()}-${file.originalname}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const doc = await PrintDocument.create({
      userId: req.user!.userId,
      fileName: file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileSize: file.size,
      mimeType: file.mimetype,
      pageCount,
    });

    documents.push({
      id: doc._id,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      pageCount: doc.pageCount,
    });
  }

  res.status(201).json({ documents });
}

export async function getUserDocuments(req: Request, res: Response): Promise<void> {
  const documents = await PrintDocument.find({ userId: req.user!.userId })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ documents });
}

export async function deleteDocument(req: Request, res: Response): Promise<void> {
  const { documentId } = req.params;

  const doc = await PrintDocument.findOne({ _id: documentId, userId: req.user!.userId });
  if (!doc) {
    throw new AppError('Document not found', 404);
  }

  await cloudinary.uploader.destroy(doc.publicId);
  await PrintDocument.deleteOne({ _id: documentId });

  res.json({ message: 'Document deleted' });
}
