import mongoose from 'mongoose';

const exchangeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['crypto-to-fiat', 'fiat-to-crypto'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  tokenAddress: {
    type: String,
    required: true
  },
  tokenSymbol: {
    type: String,
    required: true
  },
  fiatAmount: {
    type: Number,
    required: true
  },
  fiatCurrency: {
    type: String,
    default: 'USD'
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    accountHolderName: String,
    swiftCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  transactionHash: {
    type: String
  },
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
exchangeSchema.index({ userId: 1, createdAt: -1 });
exchangeSchema.index({ status: 1 });
exchangeSchema.index({ transactionHash: 1 });

const Exchange = mongoose.model('Exchange', exchangeSchema);

export default Exchange; 