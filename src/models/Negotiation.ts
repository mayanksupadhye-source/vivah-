import mongoose, { Schema, Document } from 'mongoose';

export interface INegotiationSchema extends Document {
  id: string;
  enquiryId: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  customerPhone: string;
  messages: {
    id: string;
    sender: 'customer' | 'vendor' | 'system';
    text: string;
    offerPrice?: number;
    time: string;
  }[];
  originalPrice: number;
  currentOffer: number;
  isLocked: boolean;
  agreedPrice?: number;
  createdAt: Date;
}

const NegotiationSchema = new Schema<INegotiationSchema>(
  {
    id: { type: String, required: true, unique: true },
    enquiryId: { type: String, required: true, unique: true, index: true },
    vendorId: { type: String, required: true },
    vendorName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true, index: true },
    messages: [
      {
        id: String,
        sender: { type: String, enum: ['customer', 'vendor', 'system'] },
        text: String,
        offerPrice: Number,
        time: String,
      },
    ],
    originalPrice: { type: Number, required: true },
    currentOffer: { type: Number, required: true },
    isLocked: { type: Boolean, default: false },
    agreedPrice: { type: Number },
  },
  { timestamps: true }
);

export const NegotiationModel =
  mongoose.models.Negotiation || mongoose.model<INegotiationSchema>('Negotiation', NegotiationSchema);
