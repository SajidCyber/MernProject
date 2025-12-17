const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true },
    description: { type: String },
    quantity: { type: String, required: true },
    expiryTime: { type: Date, required: true },
    imageUrl: { type: String }, // Path to uploaded food image
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Expired', 'Completed'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

foodSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Food', foodSchema);
