const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: { createdAt: 'claimedAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Claim', claimSchema);
