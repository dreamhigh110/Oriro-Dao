import mongoose from 'mongoose';

const nftRequestSchema = new mongoose.Schema({
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
    min: 1
  },
  category: {
    type: String,
    enum: ['Art', 'Real Estate', 'Financial', 'Gaming', 'Collectibles', 'Other'],
    default: 'Other'
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

const NFTRequest = mongoose.model('NFTRequest', nftRequestSchema);

export default NFTRequest;