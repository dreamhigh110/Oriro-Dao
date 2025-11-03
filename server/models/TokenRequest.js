import mongoose from 'mongoose';

const tokenRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    minlength: 2,
    maxlength: 10
  },
  description: {
    type: String,
    required: true
  },
  totalSupply: {
    type: Number,
    required: true,
    min: 1
  },
  decimals: {
    type: Number,
    required: true,
    min: 0,
    max: 18,
    default: 18
  },
  tokenType: {
    type: String,
    enum: ['ERC20', 'Utility', 'Governance', 'Security', 'Stablecoin', 'Other'],
    default: 'ERC20'
  },
  features: {
    mintable: {
      type: Boolean,
      default: false
    },
    burnable: {
      type: Boolean,
      default: false
    },
    pausable: {
      type: Boolean,
      default: false
    },
    capped: {
      type: Boolean,
      default: false
    }
  },
  initialPrice: {
    type: Number,
    required: true,
    min: 0
  },
  useCase: {
    type: String,
    required: true
  },
  targetNetwork: {
    type: String,
    enum: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'],
    default: 'Ethereum'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminFeedback: {
    type: String,
    default: ''
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

const TokenRequest = mongoose.model('TokenRequest', tokenRequestSchema);

export default TokenRequest; 