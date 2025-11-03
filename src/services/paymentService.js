import { parseEther, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { createPublicClient, http, createWalletClient } from 'viem';
import api from '../utils/api';

// Contract addresses and ABIs would be imported here
// For now using placeholder addresses
const EXCHANGE_CONTRACT_ADDRESS = '0x...'; // Replace with actual contract address

export const paymentService = {
  // Get current exchange rates
  async getExchangeRates() {
    try {
      const response = await api.get('/exchange/rates');
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  },

  // Initiate crypto to fiat exchange
  async initiateCryptoToFiat(amount, tokenAddress, bankDetails) {
    try {
      // 1. Create exchange request
      const exchangeRequest = await api.post('/exchange/crypto-to-fiat', {
        amount,
        tokenAddress,
        bankDetails,
      });

      // 2. Get transaction data for token transfer
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      });

      // 3. Prepare transaction data
      const data = await publicClient.prepareContractCall({
        address: tokenAddress,
        abi: [], // Add token ABI
        functionName: 'transfer',
        args: [EXCHANGE_CONTRACT_ADDRESS, parseEther(amount.toString())]
      });

      return {
        exchangeRequestId: exchangeRequest.data.id,
        transactionData: data
      };
    } catch (error) {
      console.error('Error initiating crypto to fiat exchange:', error);
      throw error;
    }
  },

  // Initiate fiat to crypto exchange
  async initiateFiatToCrypto(amount, tokenAddress, bankDetails) {
    try {
      const response = await api.post('/exchange/fiat-to-crypto', {
        amount,
        tokenAddress,
        bankDetails,
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating fiat to crypto exchange:', error);
      throw error;
    }
  },

  // Get exchange status
  async getExchangeStatus(exchangeId) {
    try {
      const response = await api.get(`/exchange/${exchangeId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange status:', error);
      throw error;
    }
  },

  // Get user's exchange history
  async getExchangeHistory() {
    try {
      const response = await api.get('/exchange/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange history:', error);
      throw error;
    }
  },

  // Cancel exchange request
  async cancelExchange(exchangeId) {
    try {
      const response = await api.post(`/exchange/${exchangeId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling exchange:', error);
      throw error;
    }
  }
}; 