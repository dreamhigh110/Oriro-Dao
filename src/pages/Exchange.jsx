import React, { useState } from 'react';
import ExchangeForm from '../components/exchange/ExchangeForm';
import ExchangeHistory from '../components/exchange/ExchangeHistory';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Exchange = () => {
  const [activeTab, setActiveTab] = useState('crypto-to-fiat');
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: '/exchange' }} replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Exchange
      </h1>

      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('crypto-to-fiat')}
              className={`${
                activeTab === 'crypto-to-fiat'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Crypto to Fiat
            </button>
            <button
              onClick={() => setActiveTab('fiat-to-crypto')}
              className={`${
                activeTab === 'fiat-to-crypto'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Fiat to Crypto
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ExchangeForm type={activeTab} />
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Exchange History
            </h2>
            <ExchangeHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange; 