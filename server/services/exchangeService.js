import axios from 'axios';
import ExchangeRate from '../models/ExchangeRate.js';
import { getTokenInfo } from './blockchainService.js';

// Update exchange rates from CoinGecko
export const updateExchangeRates = async () => {
  try {
    // Get list of supported tokens
    const supportedTokens = [
      {
        address: '0x123...', // Replace with actual ETH address
        symbol: 'ETH',
        coingeckoId: 'ethereum'
      },
      {
        address: '0x456...', // Replace with actual USDT address
        symbol: 'USDT',
        coingeckoId: 'tether'
      }
    ];

    // Fetch rates from CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${supportedTokens.map(t => t.coingeckoId).join(',')}&vs_currencies=usd`
    );

    // Update rates in database
    for (const token of supportedTokens) {
      const rate = response.data[token.coingeckoId]?.usd;
      if (rate) {
        await ExchangeRate.findOneAndUpdate(
          { tokenAddress: token.address },
          {
            tokenSymbol: token.symbol,
            rate,
            lastUpdated: new Date(),
            source: 'coingecko'
          },
          { upsert: true }
        );
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    throw error;
  }
};

// Calculate exchange amount
export const calculateExchangeAmount = async (amount, fromToken, toToken) => {
  try {
    // Get exchange rates
    const fromRate = await ExchangeRate.findOne({ tokenAddress: fromToken });
    const toRate = await ExchangeRate.findOne({ tokenAddress: toToken });

    if (!fromRate || !toRate) {
      throw new Error('Exchange rates not available');
    }

    // Calculate amount
    const fromAmount = amount * fromRate.rate;
    const toAmount = fromAmount / toRate.rate;

    return {
      fromAmount,
      toAmount,
      fromRate: fromRate.rate,
      toRate: toRate.rate
    };
  } catch (error) {
    console.error('Error calculating exchange amount:', error);
    throw error;
  }
};

// Get token exchange rate
export const getTokenExchangeRate = async (tokenAddress) => {
  try {
    const rate = await ExchangeRate.findOne({ tokenAddress });
    if (!rate) {
      throw new Error('Exchange rate not available');
    }
    return rate;
  } catch (error) {
    console.error('Error getting token exchange rate:', error);
    throw error;
  }
};

// Initialize exchange rates
export const initializeExchangeRates = async () => {
  try {
    // Check if we have any rates
    const count = await ExchangeRate.countDocuments();
    if (count === 0) {
      // No rates exist, fetch them
      await updateExchangeRates();
    }
    return true;
  } catch (error) {
    console.error('Error initializing exchange rates:', error);
    throw error;
  }
}; 