import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    enum: ['documentation', 'whitepaper', 'support', 'faq', 'privacy', 'terms', 'cookies']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
contentSchema.index({ type: 1 });
contentSchema.index({ isActive: 1 });

// Update lastModified and increment version on save
contentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.lastModified = new Date();
    this.version += 1;
  }
  next();
});

export default mongoose.model('Content', contentSchema); 