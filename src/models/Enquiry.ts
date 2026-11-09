import mongoose, { Schema, Document } from 'mongoose';
import { WeddingEvent } from '@/types';

export interface IEnquirySchema extends Document {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: WeddingEvent;
  eventDate: string;
  guestCount: number;
  budget: number;
  city: string;
  notes?: string;
  status: 'Pending' | 'Quotation Sent' | 'Accepted' | 'Declined' | 'Completed';
  quotedPrice?: number;
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquirySchema>(
  {
    id: { type: String, required: true, unique: true },
    vendorId: { type: String, required: true },
    vendorName: { type: String, required: true },
    vendorCategory: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true, index: true },
    customerEmail: { type: String },
    eventType: { type: String, required: true },
    eventDate: { type: String, required: true },
    guestCount: { type: Number, default: 250 },
    budget: { type: Number, required: true },
    city: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Quotation Sent', 'Accepted', 'Declined', 'Completed'],
      default: 'Pending',
    },
    quotedPrice: { type: Number },
  },
  { timestamps: true }
);

export const EnquiryModel =
  mongoose.models.Enquiry || mongoose.model<IEnquirySchema>('Enquiry', EnquirySchema);
