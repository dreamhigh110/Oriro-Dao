import mongoose from 'mongoose';

const nftHoldingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
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
    enum: ['active', 'transferred', 'burned'],
    default: 'active'
  },
  transactionHash: {
    type: String,
    sparse: true // Allows null values while maintaining uniqueness for non-null values
  }
}, {
  timestamps: true
});

// Create compound indexes
nftHoldingSchema.index({ user: 1, nft: 1 });
nftHoldingSchema.index({ transactionHash: 1 }, { unique: true, sparse: true });

const NFTHolding = mongoose.model('NFTHolding', nftHoldingSchema);

export default NFTHolding;