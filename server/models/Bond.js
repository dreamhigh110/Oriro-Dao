import mongoose from 'mongoose';

const bondSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  faceValue: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  maturityPeriod: {
    type: Number, // in days
    required: true,
    min: 1
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
  status: {
    type: String,
    enum: ['active', 'matured', 'suspended'],
    default: 'active'
  },
  metadata: {
    type: Object,
    default: {}
  },
  terms: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Bond = mongoose.model('Bond', bondSchema);

export default Bond;