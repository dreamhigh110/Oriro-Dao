import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { useBlockchain } from './BlockchainContext';
import { useAuth } from './AuthContext';

const ExchangeContext = createContext();

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};

export const ExchangeProvider = ({ children }) => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Safely destructure blockchain context with default values
  const blockchainContext = useBlockchain();
  const account = blockchainContext?.account;
  const chain = blockchainContext?.chain;
  const tokens = blockchainContext?.tokens || [];
  
  const { user } = useAuth();

  // Mock exchange rates for development
  const mockExchangeRates = {
    '0x123...': 1800, // ETH
    '0x456...': 1,    // USDT
  };

  // Fetch current exchange rates
  const fetchExchangeRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch real rates first
      const rates = await paymentService.getExchangeRates();
      setExchangeRates(rates);
    } catch (error) {
      console.warn('Using mock exchange rates due to API error:', error);
      // Fallback to mock data if API fails
      setExchangeRates(mockExchangeRates);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch exchange history
  const fetchExchangeHistory = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const history = await paymentService.getExchangeHistory();
      setExchangeHistory(history);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initiate crypto to fiat exchange
  const initiateCryptoToFiat = useCallback(async (amount, tokenAddress, bankDetails) => {
    if (!account || !chain) {
      throw new Error('Please connect your wallet first');
    }
    try {
      setLoading(true);
      setError(null);
      // For development, simulate API call
      console.log('Initiating crypto to fiat exchange:', { amount, tokenAddress, bankDetails });
      return {
        exchangeRequestId: 'mock-' + Date.now(),
        transactionData: {
          to: tokenAddress,
          value: amount,
          data: '0x'
        }
      };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [account, chain]);

  // Initiate fiat to crypto exchange
  const initiateFiatToCrypto = useCallback(async (amount, tokenAddress, bankDetails) => {
    if (!user) {
      throw new Error('Please login first');
    }
    try {
      setLoading(true);
      setError(null);
      // For development, simulate API call
      console.log('Initiating fiat to crypto exchange:', { amount, tokenAddress, bankDetails });
      return {
        exchangeRequestId: 'mock-' + Date.now(),
        status: 'pending'
      };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cancel exchange
  const cancelExchange = useCallback(async (exchangeId) => {
    try {
      setLoading(true);
      await paymentService.cancelExchange(exchangeId);
      await fetchExchangeHistory();
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExchangeHistory]);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  const value = {
    exchangeRates,
    exchangeHistory,
    loading,
    error,
    fetchExchangeRates,
    fetchExchangeHistory,
    initiateCryptoToFiat,
    initiateFiatToCrypto,
    cancelExchange,
    tokens, // Pass tokens to the context
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
};

export default ExchangeContext; 