import mongoose, { Schema, Document as MongoDoc } from 'mongoose';

export interface IPrintDoc extends MongoDoc {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  mimeType: string;
  pageCount: number;
  createdAt: Date;
}

const docSchema = new Schema<IPrintDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  pageCount: { type: Number, default: 1 },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const PrintDocument = mongoose.model<IPrintDoc>('Document', docSchema);
