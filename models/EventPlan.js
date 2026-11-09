const mongoose = require('mongoose');

const EventPlanSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    weddingLocation: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      taluka: String,
      city: { type: String, required: true },
    },
    totalBudget: { type: Number, required: true },
    totalGuests: { type: Number, default: 300 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    functions: [
      {
        event: { type: String, required: true },
        date: { type: String, required: true },
        venue: String,
        services: [{ type: String }],
        allocatedBudget: { type: Number, default: 0 },
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.EventPlan || mongoose.model('EventPlan', EventPlanSchema);
