const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema(
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

module.exports = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
