import React, { useState, useEffect } from 'react';
import { useExchange } from '../../context/ExchangeContext';
import { useBlockchain } from '../../context/BlockchainContext';
import { toast } from 'react-toastify';

const ExchangeForm = ({ type = 'crypto-to-fiat' }) => {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    bankName: '',
    accountHolderName: '',
    swiftCode: '',
  });
  const [estimatedAmount, setEstimatedAmount] = useState(0);

  const { exchangeRates, loading, error, initiateCryptoToFiat, initiateFiatToCrypto, fetchExchangeRates } = useExchange();
  const { tokens = [] } = useBlockchain() || {}; // Add default empty array

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  useEffect(() => {
    if (amount && selectedToken && exchangeRates) {
      const rate = exchangeRates[selectedToken];
      if (rate) {
        setEstimatedAmount(amount * rate);
      }
    }
  }, [amount, selectedToken, exchangeRates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'crypto-to-fiat') {
        const result = await initiateCryptoToFiat(amount, selectedToken, bankDetails);
        toast.success('Exchange initiated successfully!');
        // Handle transaction signing here
      } else {
        const result = await initiateFiatToCrypto(amount, selectedToken, bankDetails);
        toast.success('Exchange request submitted successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to initiate exchange');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {type === 'crypto-to-fiat' ? 'Crypto to Fiat Exchange' : 'Fiat to Crypto Exchange'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="">Select a token</option>
            {tokens && tokens.length > 0 ? (
              tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))
            ) : (
              <option value="" disabled>No tokens available</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bank Account Number
          </label>
          <input
            type="text"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bank Name
          </label>
          <input
            type="text"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account Holder Name
          </label>
          <input
            type="text"
            value={bankDetails.accountHolderName}
            onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SWIFT/BIC Code
          </label>
          <input
            type="text"
            value={bankDetails.swiftCode}
            onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        {estimatedAmount > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Estimated {type === 'crypto-to-fiat' ? 'Fiat' : 'Crypto'} Amount: {estimatedAmount}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Initiate Exchange'}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ExchangeForm; 