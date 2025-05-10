import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiAlertCircle, FiCheck, FiX, FiPlusCircle, FiExternalLink, FiCoffee } from 'react-icons/fi';
import { useBlockchain } from '../context/BlockchainContext';
import { useAuth } from '../context/AuthContext';
import { 
  getActiveProposals, 
  getProposal, 
  isProposalActive, 
  createProposal, 
  vote, 
  hasVoted, 
  getVotingRecord 
} from '../services/contractService';

const Governance = () => {
  const { currentUser } = useAuth();
  const { 
    isConnected, 
    chainId,
    walletAddress, 
    tokenBalance,
    chainName,
    isCorrectNetwork,
    executeTransaction,
    transactionPending
  } = useBlockchain();

  // States for governance information
  const [activeProposals, setActiveProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [votingRecord, setVotingRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState(''); // pending, success, error
  
  // States for creating a new proposal
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');

  // Effect to load active proposals
  useEffect(() => {
    if (isConnected && walletAddress && chainId) {
      loadActiveProposals();
    }
  }, [isConnected, walletAddress, chainId]);

  // Function to load active proposals
  const loadActiveProposals = async () => {
    if (!isConnected || !walletAddress || !chainId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const proposals = await getActiveProposals(chainId);
      setActiveProposals(proposals);
      
      if (proposals.length > 0 && !selectedProposal) {
        await loadProposalDetails(proposals[0]);
      } else if (selectedProposal) {
        // Refresh the selected proposal
        await loadProposalDetails(selectedProposal.id);
      }
    } catch (err) {
      console.error('Error loading active proposals:', err);
      setError('Failed to load active proposals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load proposal details
  const loadProposalDetails = async (proposalId) => {
    if (!isConnected || !walletAddress || !chainId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const proposal = await getProposal(proposalId, chainId);
      setSelectedProposal({ id: proposalId, ...proposal });
      
      // Check if user has voted
      const record = await getVotingRecord(proposalId, walletAddress, chainId);
      setVotingRecord(record);
    } catch (err) {
      console.error('Error loading proposal details:', err);
      setError('Failed to load proposal details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date from block number
  const formatBlockDate = (blockNumber) => {
    if (!blockNumber) return 'Unknown';
    
    // This is a simplified approach - for timestamp-based proposals
    // The timestamps are already in seconds since epoch
    const date = new Date(blockNumber * 1000);
    return date.toLocaleString();
  };

  // Get proposal state label
  const getProposalStateLabel = (state) => {
    // State enum in the contract: Pending = 0, Active = 1, Canceled = 2, Succeeded = 3, Defeated = 4, Executed = 5
    const stateLabels = [
      'Pending', 'Active', 'Canceled', 'Succeeded', 'Defeated', 'Executed'
    ];
    
    return stateLabels[state] || 'Unknown';
  };
  
  // Get proposal state color class
  const getProposalStateColorClass = (state) => {
    // State enum in the contract: Pending = 0, Active = 1, Canceled = 2, Succeeded = 3, Defeated = 4, Executed = 5
    const stateColors = {
      0: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', // Pending
      1: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', // Active
      2: 'bg-slate-100 text-slate-800 dark:bg-slate-700/30 dark:text-slate-400', // Canceled
      3: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', // Succeeded
      4: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', // Defeated
      5: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', // Executed
    };
    
    return stateColors[state] || 'bg-slate-100 text-slate-800 dark:bg-slate-700/30 dark:text-slate-400';
  };

  // Handle voting on a proposal
  const handleVote = async (support) => {
    if (!isConnected || !walletAddress || !chainId || !selectedProposal) {
      setError('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setShowTxModal(true);
    setTxStatus('pending');
    
    console.log("Starting voting process...");
    
    try {
      // If support is a boolean, convert to the appropriate vote type (0=against, 1=for)
      // If support is already a number (2 for abstain), use it directly
      const voteType = typeof support === 'boolean' ? (support ? 1 : 0) : support;
      
      // Get the transaction data for voting
      console.log("Getting voting transaction data...");
      const txData = await vote(selectedProposal.id, voteType, chainId);
      console.log("Voting transaction data:", txData);
      
      // Execute the transaction
      console.log("Executing voting transaction...");
      const hash = await executeTransaction(txData);
      console.log("Voting transaction hash:", hash);
      
      setTxHash(hash);
      setTxStatus('success');
      
      const voteLabels = ['NO', 'YES', 'ABSTAIN'];
      setSuccess(`Successfully voted ${voteLabels[voteType]} on proposal #${selectedProposal.id}! Transaction: ${hash.slice(0, 10)}...`);
      
      // Refresh data after voting
      await loadProposalDetails(selectedProposal.id);
    } catch (err) {
      console.error('Error voting on proposal:', err);
      setError(`Failed to vote on proposal: ${err.message}`);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
      // Keep modal open for a bit to show success/error before closing
      setTimeout(() => {
        setShowTxModal(false);
      }, 3000);
    }
  };

  // Handle creating a new proposal
  const handleCreateProposal = async () => {
    if (!isConnected || !walletAddress || !chainId) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!proposalTitle || !proposalDescription) {
      setError('Please provide a title and description for your proposal');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setShowTxModal(true);
    setTxStatus('pending');
    
    console.log("Starting proposal creation process...");
    
    try {
      // For simplicity, we're just creating a description-only proposal
      // In a real app, you would also include targets, values, and calldatas
      const fullDescription = `${proposalTitle}\n\n${proposalDescription}`;
      
      console.log("Getting proposal creation transaction data...");
      const txData = await createProposal(fullDescription, [], [], [], chainId);
      console.log("Proposal creation transaction data:", txData);
      
      // Execute the transaction
      console.log("Executing proposal creation transaction...");
      const hash = await executeTransaction(txData);
      console.log("Proposal creation transaction hash:", hash);
      
      setTxHash(hash);
      setTxStatus('success');
      
      setSuccess(`Successfully created a new proposal! Transaction: ${hash.slice(0, 10)}...`);
      setShowNewProposal(false);
      setProposalTitle('');
      setProposalDescription('');
      
      // Refresh proposals
      await loadActiveProposals();
    } catch (err) {
      console.error('Error creating proposal:', err);
      setError(`Failed to create proposal: ${err.message}`);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
      // Keep modal open for a bit to show success/error before closing
      setTimeout(() => {
        setShowTxModal(false);
      }, 3000);
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold mb-6">Governance</h1>
        <div className="flex space-x-4">
          <button 
            onClick={loadActiveProposals} 
            disabled={isLoading}
            className="text-primary hover:text-primary-dark transition-colors flex items-center text-sm disabled:text-gray-400"
          >
            <FiRefreshCw className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            onClick={() => setShowNewProposal(true)}
            disabled={isLoading || !isConnected || !isCorrectNetwork}
            className="px-4 py-2 bg-primary hover:bg-primary-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium flex items-center"
          >
            <FiPlusCircle className="mr-2" />
            New Proposal
          </button>
        </div>
      </div>
      
      {/* Wallet Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg mb-8 flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-semibold">Wallet Not Connected</p>
            <p className="text-sm mt-1">Connect your wallet to view and participate in governance proposals.</p>
          </div>
        </div>
      )}
      
      {/* Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-lg mb-8 flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="font-semibold">Wrong Network</p>
            <p className="text-sm mt-1">Please switch to the Sepolia network to use governance features.</p>
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
      
      {/* New Proposal Form */}
      {showNewProposal && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Proposal</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="proposalTitle" className="block text-sm font-medium mb-1">
                Proposal Title
              </label>
              <input
                id="proposalTitle"
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="Enter a concise title for your proposal"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-dark-light focus:outline-none focus:ring-2 focus:ring-primary p-3"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="proposalDescription" className="block text-sm font-medium mb-1">
                Proposal Description
              </label>
              <textarea
                id="proposalDescription"
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                placeholder="Provide a detailed description of your proposal"
                rows={5}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-dark-light focus:outline-none focus:ring-2 focus:ring-primary p-3"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleCreateProposal}
                disabled={isLoading || !proposalTitle || !proposalDescription}
                className="px-4 py-2 bg-primary hover:bg-primary-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
              >
                Submit Proposal
              </button>
              
              <button
                onClick={() => {
                  setShowNewProposal(false);
                  setProposalTitle('');
                  setProposalDescription('');
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-slate-800 dark:text-white rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Governance Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Proposal List */}
        <div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Active Proposals</h2>
            
            {activeProposals.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                {isLoading ? 'Loading proposals...' : 'No active proposals found'}
              </p>
            ) : (
              <div className="space-y-3">
                {activeProposals.map((proposalId) => (
                  <button
                    key={proposalId}
                    onClick={() => loadProposalDetails(proposalId)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProposal?.id === proposalId
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-dark hover:bg-slate-200 dark:hover:bg-dark-light'
                    }`}
                  >
                    <div className="font-medium">Proposal #{proposalId}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Center & Right Columns - Proposal Details */}
        {selectedProposal ? (
          <>
            {/* Center Column - Proposal Content */}
            <div className="lg:col-span-2">
              <div className="card p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Proposal #{selectedProposal.id}</h2>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Proposed by: 
                      <a 
                        href={getExplorerUrl(selectedProposal.proposer)} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary dark:text-primary-light hover:underline"
                      >
                        {selectedProposal.proposer.substring(0, 6)}...{selectedProposal.proposer.substring(selectedProposal.proposer.length - 4)}
                        <FiExternalLink className="inline ml-1 w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getProposalStateColorClass(selectedProposal.state)}`}>
                    {getProposalStateLabel(selectedProposal.state)}
                  </div>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="font-bold text-xl mb-3">
                    {selectedProposal.title || "Proposal Title"}
                  </h3>
                  <div className="whitespace-pre-wrap">
                    {selectedProposal.description}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-dark p-3 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Voting Starts</p>
                    <p className="font-medium">Block #{selectedProposal.startBlock}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Estimated: {formatBlockDate(selectedProposal.startBlock)}
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-dark p-3 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Voting Ends</p>
                    <p className="font-medium">Block #{selectedProposal.endBlock}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Estimated: {formatBlockDate(selectedProposal.endBlock)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Voting Section */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Voting</h2>
                
                {votingRecord?.hasVoted ? (
                  <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 p-4 rounded-lg mb-4">
                    <p className="font-medium">You have already voted on this proposal</p>
                    <p className="mt-1">
                      Your vote: <span className="font-semibold">
                        {votingRecord.voteType === 0 ? 'NO' : 
                         votingRecord.voteType === 1 ? 'YES' : 
                         votingRecord.voteType === 2 ? 'ABSTAIN' : 'UNKNOWN'}
                      </span>
                    </p>
                    <p className="mt-1">
                      Voting power: <span className="font-semibold">{votingRecord.weight} ORIRO</span>
                    </p>
                  </div>
                ) : selectedProposal.state !== 1 ? (
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg mb-4">
                    <p className="font-medium">Voting is not active for this proposal</p>
                    <p className="mt-1">Current state: {getProposalStateLabel(selectedProposal.state)}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">Cast your vote on this proposal:</p>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleVote(true)}
                        disabled={isLoading || !isConnected || votingRecord?.hasVoted || !isCorrectNetwork}
                        className="flex-1 flex justify-center items-center px-4 py-3 bg-green-600 hover:bg-green-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
                      >
                        <FiCheck className="mr-2" />
                        Vote For
                      </button>
                      
                      <button
                        onClick={() => handleVote(false)}
                        disabled={isLoading || !isConnected || votingRecord?.hasVoted || !isCorrectNetwork}
                        className="flex-1 flex justify-center items-center px-4 py-3 bg-red-600 hover:bg-red-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
                      >
                        <FiX className="mr-2" />
                        Vote Against
                      </button>
                      
                      <button
                        onClick={() => handleVote(2)} // 2 is the value for Abstain in the VoteType enum
                        disabled={isLoading || !isConnected || votingRecord?.hasVoted || !isCorrectNetwork}
                        className="flex-1 flex justify-center items-center px-4 py-3 bg-slate-600 hover:bg-slate-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium"
                      >
                        <FiCoffee className="mr-2" />
                        Abstain
                      </button>
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your voting power: {tokenBalance} ORIRO
                    </p>
                  </div>
                )}
                
                {/* Vote Results */}
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Current Results</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">For</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {selectedProposal.yesVotes} ORIRO ({
                            ((parseFloat(selectedProposal.yesVotes) /
                              (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes))) * 100).toFixed(2)
                          }%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${
                              parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes) > 0
                                ? (parseFloat(selectedProposal.yesVotes) / 
                                   (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes))) * 100
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Against</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {selectedProposal.noVotes} ORIRO ({
                            ((parseFloat(selectedProposal.noVotes) /
                              (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes))) * 100).toFixed(2)
                          }%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${
                              parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes) > 0
                                ? (parseFloat(selectedProposal.noVotes) / 
                                   (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes))) * 100
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Abstain</span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {selectedProposal.abstainVotes} ORIRO ({
                            ((parseFloat(selectedProposal.abstainVotes) /
                              (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes))) * 100).toFixed(2)
                          }%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-slate-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${
                              parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes) > 0
                                ? (parseFloat(selectedProposal.abstainVotes) / 
                                   (parseFloat(selectedProposal.yesVotes) + parseFloat(selectedProposal.noVotes) + parseFloat(selectedProposal.abstainVotes))) * 100
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-2">
            <div className="card p-6 flex items-center justify-center min-h-[300px]">
              <p className="text-slate-500 dark:text-slate-400 text-center">
                {isLoading 
                  ? 'Loading proposal details...'
                  : activeProposals.length > 0
                    ? 'Select a proposal to view details'
                    : 'No active proposals found. Create a new proposal to get started!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Governance; 