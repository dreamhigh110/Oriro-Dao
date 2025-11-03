import mongoose from 'mongoose';

const exchangeRateSchema = new mongoose.Schema({
  tokenAddress: {
    type: String,
    required: true,
    unique: true
  },
  tokenSymbol: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    required: true,
    enum: ['coingecko', 'binance', 'manual']
  }
}, {
  timestamps: true
});

// Indexes
exchangeRateSchema.index({ tokenAddress: 1 });
exchangeRateSchema.index({ tokenSymbol: 1 });
exchangeRateSchema.index({ lastUpdated: -1 });

const ExchangeRate = mongoose.model('ExchangeRate', exchangeRateSchema);

export default ExchangeRate; 