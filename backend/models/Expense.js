const mongoose = require('mongoose');

const CATEGORIES = [
  'food',
  'transport',
  'entertainment',
  'shopping',
  'rent',
  'utilities',
  'groceries',
  'travel',
  'subscriptions',
  'health',
  'education',
  'other',
];

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'Group is required'],
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    // Amount stored in paise (integer) to avoid floating-point errors
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1 paisa'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount must be an integer (in paise)',
      },
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Paid by is required'],
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        // Share in paise (integer)
        share: {
          type: Number,
          required: true,
          min: [0, 'Share cannot be negative'],
          validate: {
            validator: Number.isInteger,
            message: 'Share must be an integer (in paise)',
          },
        },
      },
    ],
    splitType: {
      type: String,
      enum: ['equal', 'custom'],
      required: [true, 'Split type is required'],
      default: 'equal',
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'other',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
expenseSchema.index({ groupId: 1, date: -1 });
expenseSchema.index({ paidBy: 1 });
expenseSchema.index({ 'participants.user': 1 });

// Validate that participant shares sum to total amount
expenseSchema.pre('save', function (next) {
  if (this.participants && this.participants.length > 0) {
    const totalShares = this.participants.reduce((sum, p) => sum + p.share, 0);
    if (totalShares !== this.amount) {
      return next(
        new Error(
          `Participant shares (${totalShares}) must equal total amount (${this.amount})`
        )
      );
    }
  }
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.CATEGORIES = CATEGORIES;

