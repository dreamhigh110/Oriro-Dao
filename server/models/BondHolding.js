import mongoose from 'mongoose';

const bondHoldingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bond: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bond',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'matured', 'redeemed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create a compound index for user and bond
bondHoldingSchema.index({ user: 1, bond: 1 });

const BondHolding = mongoose.model('BondHolding', bondHoldingSchema);

export default BondHolding;