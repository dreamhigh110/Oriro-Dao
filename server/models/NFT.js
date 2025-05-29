import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Art', 'Real Estate', 'Financial', 'Gaming', 'Collectibles', 'Other']
  },
  status: {
    type: String,
    enum: ['active', 'sold_out', 'suspended'],
    default: 'active'
  },
  tokenId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness for non-null values
  },
  blockchain: {
    type: String,
    enum: ['Ethereum', 'Polygon', 'Binance'],
    default: 'Ethereum'
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Create indexes
nftSchema.index({ name: 'text', description: 'text' });
nftSchema.index({ category: 1, status: 1 });

const NFT = mongoose.model('NFT', nftSchema);

export default NFT;