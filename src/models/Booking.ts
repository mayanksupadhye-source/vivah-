import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingSchema extends Document {
  id: string;
  bookingNumber: string;
  enquiryId?: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  eventDate: string;
  agreedPrice: number;
  advancePaid: number;
  totalPaid: number;
  paymentStatus: 'unpaid' | 'advance_paid' | 'fully_paid';
  bookingStatus: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBookingSchema>(
  {
    id: { type: String, required: true, unique: true },
    bookingNumber: { type: String, required: true, unique: true },
    enquiryId: { type: String },
    vendorId: { type: String, required: true, index: true },
    vendorName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true, index: true },
    customerEmail: { type: String },
    eventType: { type: String, required: true },
    eventDate: { type: String, required: true },
    agreedPrice: { type: Number, required: true },
    advancePaid: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'advance_paid', 'fully_paid'],
      default: 'unpaid',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const BookingModel =
  mongoose.models.Booking || mongoose.model<IBookingSchema>('Booking', BookingSchema);
