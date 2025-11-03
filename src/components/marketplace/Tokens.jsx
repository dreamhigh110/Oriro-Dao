import React, { useState, useEffect } from 'react';
import { FiDisc, FiTrendingUp, FiUsers, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Tokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await api.get('/marketplace/tokens');
      setTokens(response.data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Error loading tokens');
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0.000000';
    }
    return Number(price).toFixed(6);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap === undefined || marketCap === null || isNaN(marketCap)) {
      return '$0';
    }
    const cap = Number(marketCap);
    if (cap >= 1000000) {
      return `$${(cap / 1000000).toFixed(1)}M`;
    }
    return `$${(cap / 1000).toFixed(0)}K`;
  };

  const formatSupply = (supply) => {
    if (supply === undefined || supply === null || isNaN(supply)) {
      return '0';
    }
    const sup = Number(supply);
    if (sup >= 1000000) {
      return `${(sup / 1000000).toFixed(1)}M`;
    }
    return `${(sup / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tokens</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and trade custom tokens created on the Oriro platform.
        </p>
      </div>

      {tokens.length === 0 ? (
        <div className="text-center py-12">
          <FiDisc className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tokens available</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to create a custom token on the platform!
          </p>
          <Link
            to="/marketplace/create-token"
            className="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Token Request
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="bg-white dark:bg-dark-light rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {token.symbol.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {token.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {token.symbol}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (token.change24h || 0) >= 0 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                  }`}>
                    <FiTrendingUp className="mr-1" />
                    {(token.change24h || 0) >= 0 ? '+' : ''}{(token.change24h || 0).toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Current Price</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatPrice(token.currentPrice || token.initialPrice)} ETH
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Market Cap</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatMarketCap(token.marketCap)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Supply</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatSupply(token.totalSupply)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Type:</span>
                    <span className="ml-1">{token.tokenType}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Network:</span>
                    <span className="ml-1">{token.targetNetwork}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Creator:</span>
                    <span className="ml-1">{token.creator?.name}</span>
                  </div>
                </div>

                {token.features && Object.values(token.features).some(Boolean) && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(token.features).filter(([key, value]) => value).map(([feature]) => (
                        <span key={feature} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {feature.charAt(0).toUpperCase() + feature.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {token.description}
                </p>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200">
                    Trade
                  </button>
                  <button className="flex items-center justify-center bg-gray-100 dark:bg-dark-darker hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200">
                    <FiInfo className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start">
          <FiUsers className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              Want to create your own token?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              Submit a request to create your custom ERC-20 token with advanced features and multi-chain support.
            </p>
            <Link
              to="/marketplace/create-token"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Create Token Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokens; 