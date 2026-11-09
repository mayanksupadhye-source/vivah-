const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    tagline: { type: String },
    category: { type: String, required: true },
    subcategories: [{ type: String }],
    description: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    taluka: { type: String },
    city: { type: String, required: true },
    locality: { type: String },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    startingPrice: { type: Number, required: true },
    priceUnit: { type: String, default: 'per event' },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 12 },
    isVerified: { type: Boolean, default: true },
    yearsOfExperience: { type: Number, default: 5 },
    packages: [
      {
        id: String,
        name: String,
        price: Number,
        description: String,
        features: [String],
        isPopular: Boolean,
      },
    ],
    reviews: [
      {
        id: String,
        customerName: String,
        rating: Number,
        date: String,
        comment: String,
        event: String,
      },
    ],
    supportedEvents: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
