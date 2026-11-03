const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'Group is required'],
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'From user is required'],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'To user is required'],
    },
    // Amount in paise (integer)
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1 paisa'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount must be an integer (in paise)',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    settledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
settlementSchema.index({ groupId: 1 });
settlementSchema.index({ from: 1 });
settlementSchema.index({ to: 1 });
settlementSchema.index({ groupId: 1, status: 1 });

module.exports = mongoose.model('Settlement', settlementSchema);

