import React, { useState } from 'react';
import { FiRefreshCw, FiAlertCircle, FiExternalLink, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { 
    isConnected, 
    chainName, 
    walletAddress, 
    tokenBalance, 
    nativeBalance, 
    totalSupply, 
    loadingTokenData, 
    tokenError, 
    refreshTokenData,
    lastBlockNumber 
  } = useBlockchain();

  // Format big numbers for display
  const formatLargeNumber = (num) => {
    if (!num) return '0';
    const number = parseFloat(num);
    if (number < 1000) return number.toFixed(2);
    if (number < 1000000) return (number / 1000).toFixed(2) + 'K';
    if (number < 1000000000) return (number / 1000000).toFixed(2) + 'M';
    return (number / 1000000000).toFixed(2) + 'B';
  };

  // Get explorer URL based on chain
  const getExplorerUrl = (address) => {
    if (!address) return '#';
    
    // Basic mapping of explorers by chain name
    const explorers = {
      'Ethereum': `https://etherscan.io/address/${address}`,
      'Sepolia': `https://sepolia.etherscan.io/address/${address}`,
      'Polygon': `https://polygonscan.com/address/${address}`,
      'BSC': `https://bscscan.com/address/${address}`,
    };
    
    return explorers[chainName] || '#';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold">Dashboard(My telegram username: @smiler0x)</h1>
        
        {/* Admin Panel Link (only for admins) */}
        {currentUser?.role === 'admin' && (
          <Link 
            to="/admin" 
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            <FiShield className="mr-2" /> Admin Panel
          </Link>
        )}
      </div>
      
      {/* Wallet Connection Status */}
      {!isConnected ? (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg mb-8 flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-semibold">Wallet Not Connected</p>
            <p className="text-sm mt-1">Connect your wallet to view your balances and interact with the platform.</p>
            <Link 
              to="/connect-wallet" 
              className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-4 rounded-lg mb-8 flex items-start">
          <svg className="mt-1 mr-2 flex-shrink-0 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold">Wallet Connected</p>
            <div className="text-sm mt-1 flex items-center">
              <span className="font-mono">{walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}</span>
              <a 
                href={getExplorerUrl(walletAddress)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 text-primary dark:text-primary-light hover:underline inline-flex items-center"
              >
                <FiExternalLink className="w-3 h-3" />
                <span className="ml-1">View on Explorer</span>
              </a>
            </div>
            <p className="text-sm mt-1">Network: {chainName || 'Unknown'}</p>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Balances */}
        <div>
          <div className="card p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Balances</h2>
              <button 
                onClick={refreshTokenData} 
                disabled={loadingTokenData}
                className="text-primary hover:text-primary-dark transition-colors flex items-center text-sm"
                title="Refresh balance"
              >
                <FiRefreshCw className={`mr-1 ${loadingTokenData ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            {tokenError && (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm mb-4">
                {tokenError}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Native Token Balance */}
              <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-dark rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-dark-light rounded-full flex items-center justify-center text-lg font-bold mr-3">
                    {chainName?.substring(0, 1) || '?'}
                  </div>
                  <div>
                    <p className="font-medium">Native Token</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{chainName || 'Unknown'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{nativeBalance}</p>
                </div>
              </div>
              
              {/* ORIRO Token Balance */}
              <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-dark rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mr-3">
                    O
                  </div>
                  <div>
                    <p className="font-medium">ORIRO Token</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Platform Token</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{loadingTokenData ? 'Loading...' : formatLargeNumber(tokenBalance)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ORIRO</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transaction History - Placeholder */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              Transaction history coming soon
            </p>
          </div>
        </div>
        
        {/* Right Column - Platform Stats */}
        <div>
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Platform Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Supply</p>
                <p className="text-2xl font-bold">{formatLargeNumber(totalSupply)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">ORIRO</p>
              </div>
              
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Current Block</p>
                <p className="text-2xl font-bold">{lastBlockNumber ? lastBlockNumber.toLocaleString() : 'N/A'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{chainName || 'Unknown'}</p>
              </div>
              
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Your Share</p>
                <p className="text-2xl font-bold">
                  {loadingTokenData || !totalSupply || parseFloat(totalSupply) === 0 
                    ? 'N/A' 
                    : ((parseFloat(tokenBalance) / parseFloat(totalSupply)) * 100).toFixed(4) + '%'
                  }
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">of Total Supply</p>
              </div>
              
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Network</p>
                <p className="text-2xl font-bold">{chainName || 'Unknown'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Connected Chain</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Link to="/staking" className="bg-primary hover:bg-primary-dark transition-colors text-white p-4 rounded-lg text-center">
                <p className="font-medium">Stake Tokens</p>
                <p className="text-sm mt-1 text-white/80">Earn rewards</p>
              </Link>
              
              <Link to="/governance" className="bg-blue-600 hover:bg-blue-700 transition-colors text-white p-4 rounded-lg text-center">
                <p className="font-medium">Governance</p>
                <p className="text-sm mt-1 text-white/80">Vote on proposals</p>
              </Link>
              
              <Link to="/marketplace" className="bg-purple-600 hover:bg-purple-700 transition-colors text-white p-4 rounded-lg text-center">
                <p className="font-medium">Marketplace</p>
                <p className="text-sm mt-1 text-white/80">Trade assets</p>
              </Link>
              
              <Link to="/profile" className="bg-slate-700 hover:bg-slate-800 transition-colors text-white p-4 rounded-lg text-center">
                <p className="font-medium">Profile</p>
                <p className="text-sm mt-1 text-white/80">Manage account</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 