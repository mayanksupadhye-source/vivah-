const mongoose = require('mongoose');

const NegotiationSchema = new mongoose.Schema(
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

module.exports = mongoose.models.Negotiation || mongoose.model('Negotiation', NegotiationSchema);
