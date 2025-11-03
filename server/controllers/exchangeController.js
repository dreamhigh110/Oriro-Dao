import Exchange from '../models/Exchange.js';
import ExchangeRate from '../models/ExchangeRate.js';
import { getTokenInfo } from '../services/blockchainService.js';
import { updateExchangeRates } from '../services/exchangeService.js';

// Get current exchange rates
export const getExchangeRates = async (req, res) => {
  try {
    // Update rates from external source
    await updateExchangeRates();

    // Get all current rates
    const rates = await ExchangeRate.find({}, { tokenAddress: 1, tokenSymbol: 1, rate: 1, lastUpdated: 1 });
    
    // Convert to the format expected by the frontend
    const formattedRates = rates.reduce((acc, rate) => {
      acc[rate.tokenAddress] = rate.rate;
      return acc;
    }, {});

    res.json(formattedRates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ message: 'Error fetching exchange rates' });
  }
};

// Initiate crypto to fiat exchange
export const initiateCryptoToFiat = async (req, res) => {
  try {
    const { amount, tokenAddress, bankDetails } = req.body;
    const userId = req.user._id;

    // Get token info
    const tokenInfo = await getTokenInfo(tokenAddress);
    if (!tokenInfo) {
      return res.status(400).json({ message: 'Invalid token address' });
    }

    // Get current exchange rate
    const exchangeRate = await ExchangeRate.findOne({ tokenAddress });
    if (!exchangeRate) {
      return res.status(400).json({ message: 'Exchange rate not available for this token' });
    }

    // Calculate fiat amount
    const fiatAmount = amount * exchangeRate.rate;

    // Create exchange record
    const exchange = new Exchange({
      userId,
      type: 'crypto-to-fiat',
      amount,
      tokenAddress,
      tokenSymbol: tokenInfo.symbol,
      fiatAmount,
      bankDetails
    });

    await exchange.save();

    res.json({
      exchangeId: exchange._id,
      status: exchange.status,
      fiatAmount
    });
  } catch (error) {
    console.error('Error initiating crypto to fiat exchange:', error);
    res.status(500).json({ message: 'Error initiating exchange' });
  }
};

// Initiate fiat to crypto exchange
export const initiateFiatToCrypto = async (req, res) => {
  try {
    const { amount, tokenAddress, bankDetails } = req.body;
    const userId = req.user._id;

    // Get token info
    const tokenInfo = await getTokenInfo(tokenAddress);
    if (!tokenInfo) {
      return res.status(400).json({ message: 'Invalid token address' });
    }

    // Get current exchange rate
    const exchangeRate = await ExchangeRate.findOne({ tokenAddress });
    if (!exchangeRate) {
      return res.status(400).json({ message: 'Exchange rate not available for this token' });
    }

    // Calculate crypto amount
    const cryptoAmount = amount / exchangeRate.rate;

    // Create exchange record
    const exchange = new Exchange({
      userId,
      type: 'fiat-to-crypto',
      amount: cryptoAmount,
      tokenAddress,
      tokenSymbol: tokenInfo.symbol,
      fiatAmount: amount,
      bankDetails
    });

    await exchange.save();

    res.json({
      exchangeId: exchange._id,
      status: exchange.status,
      cryptoAmount
    });
  } catch (error) {
    console.error('Error initiating fiat to crypto exchange:', error);
    res.status(500).json({ message: 'Error initiating exchange' });
  }
};

// Get exchange status
export const getExchangeStatus = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const userId = req.user._id;

    const exchange = await Exchange.findOne({ _id: exchangeId, userId });
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    res.json({
      status: exchange.status,
      amount: exchange.amount,
      fiatAmount: exchange.fiatAmount,
      tokenSymbol: exchange.tokenSymbol,
      createdAt: exchange.createdAt,
      updatedAt: exchange.updatedAt
    });
  } catch (error) {
    console.error('Error fetching exchange status:', error);
    res.status(500).json({ message: 'Error fetching exchange status' });
  }
};

// Get user's exchange history
export const getExchangeHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const exchanges = await Exchange.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Exchange.countDocuments({ userId });

    res.json({
      exchanges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching exchange history:', error);
    res.status(500).json({ message: 'Error fetching exchange history' });
  }
};

// Cancel exchange
export const cancelExchange = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const userId = req.user._id;

    const exchange = await Exchange.findOne({ _id: exchangeId, userId });
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    if (exchange.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending exchanges' });
    }

    exchange.status = 'cancelled';
    await exchange.save();

    res.json({ message: 'Exchange cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling exchange:', error);
    res.status(500).json({ message: 'Error cancelling exchange' });
  }
}; 