import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiAlertCircle, FiLock, FiUnlock, FiGift } from 'react-icons/fi';
import { useBlockchain } from '../context/BlockchainContext';
import { useAuth } from '../context/AuthContext';
import { 
  getStakeInfo, 
  getAvailableRewards, 
  getTotalStaked, 
  stakeTokens, 
  unstakeTokens, 
  claimRewards,
  getTokenAllowance,
  approveTokens,
  canWithdraw
} from '../services/contractService';

const Staking = () => {
  const { currentUser } = useAuth();
  const { 
    isConnected, 
    chainId,
    walletAddress, 
    tokenBalance,
    refreshTokenData,
    isCorrectNetwork,
    executeTransaction,
    transactionPending
  } = useBlockchain();

  // States for staking information
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState(''); // pending, success, error
  const [stakedInfo, setStakedInfo] = useState({
    stakedAmount: '0',
    rewards: '0',
    lastUpdateTime: 0
  });
  const [totalStakedTokens, setTotalStakedTokens] = useState('0');
  const [allowance, setAllowance] = useState('0');
  const [canWithdrawTokens, setCanWithdrawTokens] = useState(false);

  // Effect to load staking data
  useEffect(() => {
    if (isConnected && walletAddress && chainId) {
      loadStakingData();
    }
  }, [isConnected, walletAddress, chainId]);

  // Function to load staking data
  const loadStakingData = async () => {
    if (!isConnected || !walletAddress || !chainId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get staking info
      const stakeInfo = await getStakeInfo(walletAddress, chainId);
      setStakedInfo(stakeInfo);
      
      // Get total staked
      const totalStaked = await getTotalStaked(chainId);
      setTotalStakedTokens(totalStaked);
      
      // Check if user can withdraw
      const withdrawable = await canWithdraw(walletAddress, chainId);
      setCanWithdrawTokens(withdrawable);
      
      // Get allowance for staking contract
      const stakingContractAddress = chainId === 11155111 ? 
        '0x52F084771589A99ed262a072684FB6decA0116b5' : 
        '0x...'; // Add addresses for other networks
      
      const tokenAllowance = await getTokenAllowance(walletAddress, stakingContractAddress, chainId);
      setAllowance(tokenAllowance);
    } catch (err) {
      console.error('Error loading staking data:', err);
      setError('Failed to load staking data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'Never';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Format percentage
  const formatPercentage = (part, total) => {
    if (!part || !total || parseFloat(total) === 0) return '0%';
    return ((parseFloat(part) / parseFloat(total)) * 100).toFixed(2) + '%';
  };

  // Handle approving tokens for staking
  const handleApprove = async () => {
    if (!isConnected || !walletAddress || !chainId) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setShowTxModal(true);
    setTxStatus('pending');
    
    console.log("Starting approval process...");
    
    try {
      const stakingContractAddress = chainId === 11155111 ? 
        '0x52F084771589A99ed262a072684FB6decA0116b5' : 
        '0x...'; // Add addresses for other networks
      
      // Get the transaction data for approval
      console.log("Getting approval transaction data...");
      const txData = await approveTokens(stakingContractAddress, '1000000', chainId);
      console.log("Approval transaction data:", txData);
      
      // Execute the transaction
      console.log("Executing approval transaction...");
      const hash = await executeTransaction(txData);
      console.log("Approval transaction hash:", hash);
      
      setTxHash(hash);
      setTxStatus('success');
      setSuccess(`Successfully approved tokens for staking! Transaction: ${hash.slice(0, 10)}...`);
      
      // Refresh allowance after approval
      const tokenAllowance = await getTokenAllowance(walletAddress, stakingContractAddress, chainId);
      setAllowance(tokenAllowance);
    } catch (err) {
      console.error('Error approving tokens:', err);
      setError(`Failed to approve tokens: ${err.message}`);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
      // Keep modal open for a bit to show success/error before closing
      setTimeout(() => {
        setShowTxModal(false);
      }, 3000);
    }
  };

  // Handle staking tokens
  const handleStake = async () => {
    if (!isConnected || !walletAddress || !chainId) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError('Please enter a valid amount to stake');
      return;
    }
    
    if (parseFloat(stakeAmount) > parseFloat(tokenBalance)) {
      setError('Insufficient balance to stake');
      return;
    }
    
    if (parseFloat(allowance) < parseFloat(stakeAmount)) {
      setError('Insufficient allowance. Please approve tokens first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setShowTxModal(true);
    setTxStatus('pending');
    
    console.log("Starting staking process...");
    
    try {
      // Get the transaction data for staking
      console.log("Getting staking transaction data...");
      const txData = await stakeTokens(stakeAmount, chainId);
      console.log("Staking transaction data:", txData);
      
      // Execute the transaction
      console.log("Executing staking transaction...");
      const hash = await executeTransaction(txData);
      console.log("Staking transaction hash:", hash);
      
      setTxHash(hash);
      setTxStatus('success');
      setSuccess(`Successfully staked ${stakeAmount} ORIRO tokens! Transaction: ${hash.slice(0, 10)}...`);
      setStakeAmount('');
      
      // Refresh data after staking
      await loadStakingData();
      await refreshTokenData();
    } catch (err) {
      console.error('Error staking tokens:', err);
      setError(`Failed to stake tokens: ${err.message}`);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
      // Keep modal open for a bit to show success/error before closing
      setTimeout(() => {
        setShowTxModal(false);
      }, 3000);
    }
  };

  // Handle unstaking tokens
  const handleUnstake = async () => {
    if (!isConnected || !walletAddress || !chainId) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      setError('Please enter a valid amount to unstake');
      return;
    }
    
    if (parseFloat(unstakeAmount) > parseFloat(stakedInfo.stakedAmount)) {
      setError('Cannot unstake more than your staked amount');
      return;
    }
    
    if (!canWithdrawTokens) {
      setError('You cannot withdraw yet. The minimum staking period has not passed.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setShowTxModal(true);
    setTxStatus('pending');
    
    console.log("Starting unstaking process...");
    
    try {
      // Get the transaction data for unstaking
      console.log("Getting unstaking transaction data...");
      const txData = await unstakeTokens(unstakeAmount, chainId);
      console.log("Unstaking transaction data:", txData);
      
      // Execute the transaction
      console.log("Executing unstaking transaction...");
      const hash = await executeTransaction(txData);
      console.log("Unstaking transaction hash:", hash);
      
      setTxHash(hash);
      setTxStatus('success');
      setSuccess(`Successfully unstaked ${unstakeAmount} ORIRO tokens! Transaction: ${hash.slice(0, 10)}...`);
      setUnstakeAmount('');
      
      // Refresh data after unstaking
      await loadStakingData();
      await refreshTokenData();
    } catch (err) {
      console.error('Error unstaking tokens:', err);
      setError(`Failed to unstake tokens: ${err.message}`);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
      // Keep modal open for a bit to show success/error before closing
      setTimeout(() => {
        setShowTxModal(false);
      }, 3000);
    }
  };

  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!isConnected || !walletAddress || !chainId) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (parseFloat(stakedInfo.rewards) <= 0) {
      setError('No rewards available to claim');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setShowTxModal(true);
    setTxStatus('pending');
    
    console.log("Starting claim rewards process...");
    
    try {
      // Get the transaction data for claiming rewards
      console.log("Getting claim rewards transaction data...");
      const txData = await claimRewards(chainId);
      console.log("Claim rewards transaction data:", txData);
      
      // Execute the transaction
      console.log("Executing claim rewards transaction...");
      const hash = await executeTransaction(txData);
      console.log("Claim rewards transaction hash:", hash);
      
      setTxHash(hash);
      setTxStatus('success');
      setSuccess(`Successfully claimed ${stakedInfo.rewards} ORIRO tokens in rewards! Transaction: ${hash.slice(0, 10)}...`);
      
      // Refresh data after claiming
      await loadStakingData();
      await refreshTokenData();
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError(`Failed to claim rewards: ${err.message}`);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
      // Keep modal open for a bit to show success/error before closing
      setTimeout(() => {
        setShowTxModal(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold mb-6">Staking</h1>
      
      {/* Wallet Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg mb-8 flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-semibold">Wallet Not Connected</p>
            <p className="text-sm mt-1">Connect your wallet to stake your tokens and earn rewards.</p>
          </div>
        </div>
      )}
      
      {/* Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-lg mb-8 flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-semibold">Wrong Network</p>
            <p className="text-sm mt-1">Please switch to the Sepolia network to use staking features.</p>
          </div>
        </div>
      )}
      
      {/* Error & Success Messages */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg mb-4">
          {success}
        </div>
      )}
      
      {/* Transaction Modal */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark-light rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Transaction Status</h3>
            
            {txStatus === 'pending' && (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p>Transaction in progress...</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Please confirm the transaction in your wallet</p>
              </div>
            )}
            
            {txStatus === 'success' && (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Transaction successful!</p>
                {txHash && (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    View on Etherscan
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            )}
            
            {txStatus === 'error' && (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full p-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p>Transaction failed</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTxModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-slate-800 dark:text-white rounded-md font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Staking Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Staking Info */}
        <div>
          <div className="card p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Staking Overview</h2>
              <button 
                onClick={loadStakingData} 
                disabled={isLoading}
                className="text-primary hover:text-primary-dark transition-colors flex items-center text-sm"
              >
                <FiRefreshCw className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Staked</p>
                <p className="text-2xl font-bold">{stakedInfo.stakedAmount} ORIRO</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatPercentage(stakedInfo.stakedAmount, totalStakedTokens)} of total staked tokens
                </p>
              </div>
              
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Available Rewards</p>
                <p className="text-2xl font-bold">{stakedInfo.rewards} ORIRO</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last updated: {formatDate(stakedInfo.lastUpdateTime)}
                </p>
              </div>
              
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Your Balance</p>
                <p className="text-2xl font-bold">{tokenBalance} ORIRO</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Available for staking</p>
              </div>
              
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Platform Staked</p>
                <p className="text-2xl font-bold">{totalStakedTokens} ORIRO</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">From all stakers</p>
              </div>
              
              <div className="bg-slate-100 dark:bg-dark p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Withdrawal Status</p>
                <p className="text-xl font-bold flex items-center">
                  {canWithdrawTokens ? (
                    <><FiUnlock className="mr-2 text-green-500" /> Available</>
                  ) : (
                    <><FiLock className="mr-2 text-yellow-500" /> Locked</>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {canWithdrawTokens 
                    ? "You can withdraw your staked tokens" 
                    : "Minimum staking period not yet reached"}
                </p>
              </div>
            </div>
            
            {/* Claim Rewards Button */}
            <button
              onClick={handleClaimRewards}
              disabled={isLoading || !isConnected || parseFloat(stakedInfo.rewards) <= 0 || !isCorrectNetwork}
              className="w-full mt-6 flex justify-center items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
            >
              <FiGift className="mr-2" />
              Claim Rewards
            </button>
          </div>
        </div>
        
        {/* Right Column - Stake/Unstake */}
        <div>
          {/* Stake Tokens */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Stake Tokens</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="stakeAmount" className="block text-sm font-medium mb-1">
                  Amount to Stake
                </label>
                <div className="flex">
                  <input
                    id="stakeAmount"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-dark-light focus:outline-none focus:ring-2 focus:ring-primary p-3"
                    disabled={isLoading || !isConnected}
                  />
                  <button
                    onClick={() => setStakeAmount(tokenBalance)}
                    className="ml-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md text-sm font-medium"
                    disabled={isLoading || !isConnected}
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Available: {tokenBalance} ORIRO
                </p>
              </div>
              
              {parseFloat(allowance) < parseFloat(stakeAmount || '0') ? (
                <button
                  onClick={handleApprove}
                  disabled={isLoading || !isConnected || !stakeAmount || parseFloat(stakeAmount) <= 0 || !isCorrectNetwork}
                  className="w-full flex justify-center items-center px-4 py-3 bg-primary hover:bg-primary-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
                >
                  <FiUnlock className="mr-2" />
                  Approve Tokens First
                </button>
              ) : (
                <button
                  onClick={handleStake}
                  disabled={isLoading || !isConnected || !stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > parseFloat(tokenBalance) || !isCorrectNetwork}
                  className="w-full flex justify-center items-center px-4 py-3 bg-primary hover:bg-primary-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
                >
                  <FiLock className="mr-2" />
                  Stake Tokens
                </button>
              )}
            </div>
          </div>
          
          {/* Unstake Tokens */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Unstake Tokens</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="unstakeAmount" className="block text-sm font-medium mb-1">
                  Amount to Unstake
                </label>
                <div className="flex">
                  <input
                    id="unstakeAmount"
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-dark-light focus:outline-none focus:ring-2 focus:ring-primary p-3"
                    disabled={isLoading || !isConnected}
                  />
                  <button
                    onClick={() => setUnstakeAmount(stakedInfo.stakedAmount)}
                    className="ml-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md text-sm font-medium"
                    disabled={isLoading || !isConnected}
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Staked: {stakedInfo.stakedAmount} ORIRO
                </p>
              </div>
              
              <button
                onClick={handleUnstake}
                disabled={isLoading || !isConnected || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > parseFloat(stakedInfo.stakedAmount) || !canWithdrawTokens || !isCorrectNetwork}
                className="w-full flex justify-center items-center px-4 py-3 bg-slate-700 hover:bg-slate-800 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
              >
                <FiUnlock className="mr-2" />
                Unstake Tokens
              </button>
              
              {!canWithdrawTokens && parseFloat(stakedInfo.stakedAmount) > 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  You cannot withdraw yet. The minimum staking period has not been reached.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking; 