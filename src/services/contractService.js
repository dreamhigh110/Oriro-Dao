import { createPublicClient, http, createWalletClient } from 'viem';
import { parseEther, formatEther } from 'viem';
import { sepolia } from 'viem/chains';

// Import contract ABIs
import OriroTokenABI from '../contracts/abis/OriroToken.json';
import OriroStakingABI from '../contracts/abis/OriroStaking.json';
import OriroGovernanceABI from '../contracts/abis/OriroGovernance.json';

// Contract addresses by chain ID - We'll use Sepolia for now
const contractAddresses = {
  token: '0x15fDEA51F6a78BBce9515decec902bE82755287c',
  staking: '0x52F084771589A99ed262a072684FB6decA0116b5',
  governance: '0x30b7D35fC41529F04D902Fd0eF6dace1d1F87A33'
};

// Create a public client for Sepolia
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// Helper function to get contract ABI
const getContractABI = (contractType) => {
  switch (contractType) {
    case 'token':
      return OriroTokenABI.abi;
    case 'staking':
      return OriroStakingABI.abi;
    case 'governance':
      return OriroGovernanceABI.abi;
    default:
      throw new Error(`Unknown contract type: ${contractType}`);
  }
};

/**
 * Get the token balance for an address
 * @param {string} address - The address to check
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<string>} The token balance
 */
export const getTokenBalance = async (address, chainId) => {
  try {
    const balance = await publicClient.readContract({
      address: contractAddresses.token,
      abi: OriroTokenABI.abi,
      functionName: 'balanceOf',
      args: [address]
    });
    
    return formatEther(balance);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};

/**
 * Get the total supply of tokens
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<string>} The total supply
 */
export const getTotalSupply = async (chainId) => {
  try {
    const supply = await publicClient.readContract({
      address: contractAddresses.token,
      abi: OriroTokenABI.abi,
      functionName: 'totalSupply'
    });
    
    return formatEther(supply);
  } catch (error) {
    console.error('Error getting total supply:', error);
    return '0';
  }
};

/**
 * Get token allowance for a spender
 * @param {string} owner - The owner address
 * @param {string} spender - The spender address
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<string>} The allowance
 */
export const getTokenAllowance = async (owner, spender, chainId) => {
  try {
    const allowance = await publicClient.readContract({
      address: contractAddresses.token,
      abi: OriroTokenABI.abi,
      functionName: 'allowance',
      args: [owner, spender]
    });
    
    return formatEther(allowance);
  } catch (error) {
    console.error('Error getting token allowance:', error);
    return '0';
  }
};

/**
 * Approve tokens for a spender (this is a write function that requires a wallet)
 * @param {string} spender - The spender address
 * @param {string} amount - The amount to approve
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Transaction data
 */
export const approveTokens = async (spender, amount, chainId) => {
  // For write functions, we'll return the data needed for the user's wallet to send the transaction
  return {
    address: contractAddresses.token,
    abi: OriroTokenABI.abi,
    functionName: 'approve',
    args: [spender, parseEther(amount)]
  };
};

/**
 * Transfer tokens to an address (this is a write function that requires a wallet)
 * @param {string} to - The recipient address
 * @param {string} amount - The amount to transfer
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Transaction data
 */
export const transferTokens = async (to, amount, chainId) => {
  return {
    address: contractAddresses.token,
    abi: OriroTokenABI.abi,
    functionName: 'transfer',
    args: [to, parseEther(amount)]
  };
};

// Staking Functions

/**
 * Get staking information for a user
 * @param {string} address - The address to check
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} The stake info
 */
export const getStakeInfo = async (address, chainId) => {
  try {
    const [stakedAmount, rewards, timestamp] = await Promise.all([
      publicClient.readContract({
        address: contractAddresses.staking,
        abi: OriroStakingABI.abi,
        functionName: 'balanceOf',
        args: [address]
      }),
      publicClient.readContract({
        address: contractAddresses.staking,
        abi: OriroStakingABI.abi,
        functionName: 'earned',
        args: [address]
      }),
      publicClient.readContract({
        address: contractAddresses.staking,
        abi: OriroStakingABI.abi,
        functionName: 'stakingTimestamps',
        args: [address]
      })
    ]);

    return {
      stakedAmount: formatEther(stakedAmount),
      rewards: formatEther(rewards),
      lastUpdateTime: Number(timestamp)
    };
  } catch (error) {
    console.error('Error getting stake info:', error);
    return {
      stakedAmount: '0',
      rewards: '0',
      lastUpdateTime: 0
    };
  }
};

/**
 * Get available rewards for a user
 * @param {string} address - The address to check
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<string>} Available rewards
 */
export const getAvailableRewards = async (address, chainId) => {
  try {
    const rewards = await publicClient.readContract({
      address: contractAddresses.staking,
      abi: OriroStakingABI.abi,
      functionName: 'earned',
      args: [address]
    });
    
    return formatEther(rewards);
  } catch (error) {
    console.error('Error getting available rewards:', error);
    return '0';
  }
};

/**
 * Get total staked tokens
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<string>} Total staked tokens
 */
export const getTotalStaked = async (chainId) => {
  try {
    const totalStaked = await publicClient.readContract({
      address: contractAddresses.staking,
      abi: OriroStakingABI.abi,
      functionName: 'totalSupply'
    });
    
    return formatEther(totalStaked);
  } catch (error) {
    console.error('Error getting total staked:', error);
    return '0';
  }
};

/**
 * Check if a user can withdraw
 * @param {string} address - The address to check
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<boolean>} Whether the user can withdraw
 */
export const canWithdraw = async (address, chainId) => {
  try {
    const canWithdrawResult = await publicClient.readContract({
      address: contractAddresses.staking,
      abi: OriroStakingABI.abi,
      functionName: 'canWithdraw',
      args: [address]
    });
    
    return canWithdrawResult;
  } catch (error) {
    console.error('Error checking if user can withdraw:', error);
    return false;
  }
};

/**
 * Stake tokens (this is a write function that requires a wallet)
 * @param {string} amount - Amount to stake
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Transaction data
 */
export const stakeTokens = async (amount, chainId) => {
  return {
    address: contractAddresses.staking,
    abi: OriroStakingABI.abi,
    functionName: 'stake',
    args: [parseEther(amount)]
  };
};

/**
 * Unstake tokens (this is a write function that requires a wallet)
 * @param {string} amount - Amount to unstake
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Transaction data
 */
export const unstakeTokens = async (amount, chainId) => {
  return {
    address: contractAddresses.staking,
    abi: OriroStakingABI.abi,
    functionName: 'withdraw',
    args: [parseEther(amount)]
  };
};

/**
 * Claim staking rewards (this is a write function that requires a wallet)
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Transaction data
 */
export const claimRewards = async (chainId) => {
  return {
    address: contractAddresses.staking,
    abi: OriroStakingABI.abi,
    functionName: 'getReward'
  };
};

// Governance Functions

/**
 * Get active proposals
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<number[]>} List of active proposal IDs
 */
export const getActiveProposals = async (chainId) => {
  try {
    const proposalCount = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'proposalCount'
    });
    
    // If there are no proposals yet, return an empty array
    if (Number(proposalCount) === 0) {
      return [];
    }
    
    // Since there's no direct getActiveProposals() method in the ABI,
    // we'll check each proposal to see if it's active
    const activeProposals = [];
    for (let i = 1; i <= Number(proposalCount); i++) {
      try {
        const state = await publicClient.readContract({
          address: contractAddresses.governance,
          abi: OriroGovernanceABI.abi,
          functionName: 'getProposalState',
          args: [i]
        });
        // State 1 is 'Active' in the ProposalState enum
        if (state === 1) {
          activeProposals.push(i);
        }
      } catch (error) {
        console.warn(`Error checking state for proposal ${i}:`, error.message);
        // Continue checking other proposals even if one fails
        continue;
      }
    }
    
    return activeProposals;
  } catch (error) {
    console.error('Error getting active proposals:', error);
    return [];
  }
};

/**
 * Get proposal details
 * @param {number} proposalId - The proposal ID
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Proposal details
 */
export const getProposal = async (proposalId, chainId) => {
  try {
    // First check if the proposalId is valid by checking the proposal count
    const proposalCount = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'proposalCount'
    });
    
    if (proposalId > Number(proposalCount)) {
      console.warn(`Proposal ID ${proposalId} is greater than the proposal count ${proposalCount}`);
      return null;
    }
    
    let proposal;
    let state;
    
    try {
      proposal = await publicClient.readContract({
        address: contractAddresses.governance,
        abi: OriroGovernanceABI.abi,
        functionName: 'getProposal',
        args: [proposalId]
      });
    } catch (error) {
      console.error(`Error getting proposal ${proposalId}:`, error);
      return null;
    }
    
    try {
      state = await publicClient.readContract({
        address: contractAddresses.governance,
        abi: OriroGovernanceABI.abi,
        functionName: 'getProposalState',
        args: [proposalId]
      });
    } catch (error) {
      console.error(`Error getting state for proposal ${proposalId}:`, error);
      // Default to Pending state (0) if we can't get the state
      state = 0;
    }
    
    return {
      proposer: proposal.proposer,
      title: proposal.title,
      description: proposal.description,
      startBlock: Number(proposal.startTime),
      endBlock: Number(proposal.endTime),
      yesVotes: formatEther(proposal.forVotes),
      noVotes: formatEther(proposal.againstVotes),
      abstainVotes: formatEther(proposal.abstainVotes),
      executed: proposal.executed,
      finalized: state === 3 || state === 4, // Succeeded or Defeated
      passed: state === 3, // Succeeded
      state: Number(state)
    };
  } catch (error) {
    console.error('Error getting proposal:', error);
    return null;
  }
};

/**
 * Check if a proposal is active
 * @param {number} proposalId - The proposal ID
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<boolean>} Whether the proposal is active
 */
export const isProposalActive = async (proposalId, chainId) => {
  try {
    // First check if the proposalId is valid by checking the proposal count
    const proposalCount = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'proposalCount'
    });
    
    if (proposalId > Number(proposalCount)) {
      console.warn(`Proposal ID ${proposalId} is greater than the proposal count ${proposalCount}`);
      return false;
    }
    
    const state = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'getProposalState',
      args: [proposalId]
    });
    // State 1 is 'Active' in the ProposalState enum
    return state === 1;
  } catch (error) {
    console.error('Error checking if proposal is active:', error);
    return false;
  }
};

/**
 * Create a new proposal (this is a write function that requires a wallet)
 * @param {string} description - Proposal description
 * @param {string[]} targets - Target addresses for the proposal (not used in new contract)
 * @param {string[]} values - Values for each target (not used in new contract)
 * @param {string[]} calldatas - Call data for each target (not used in new contract)
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Transaction data
 */
export const createProposal = async (description, targets, values, calldatas, chainId) => {
  // Split the description into title and description
  let title = description;
  let desc = '';
  
  if (description.includes('\n')) {
    const parts = description.split('\n\n', 2);
    title = parts[0].trim();
    desc = parts.length > 1 ? parts[1].trim() : '';
  }

  return {
    address: contractAddresses.governance,
    abi: OriroGovernanceABI.abi,
    functionName: 'createProposal',
    args: [title, desc]
  };
};

/**
 * Vote on a proposal (this is a write function that requires a wallet)
 * @param {number} proposalId - The proposal ID
 * @param {number} voteType - The vote type (0=Against, 1=For, 2=Abstain)
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Transaction data
 */
export const vote = async (proposalId, voteType, chainId) => {
  return {
    address: contractAddresses.governance,
    abi: OriroGovernanceABI.abi,
    functionName: 'castVote',
    args: [proposalId, voteType]
  };
};

/**
 * Check if an address has voted on a proposal
 * @param {number} proposalId - The proposal ID
 * @param {string} voter - The voter address
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<boolean>} Whether the address has voted
 */
export const hasVoted = async (proposalId, voter, chainId) => {
  try {
    // First check if the proposalId is valid by checking the proposal count
    const proposalCount = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'proposalCount'
    });
    
    if (proposalId > Number(proposalCount)) {
      console.warn(`Proposal ID ${proposalId} is greater than the proposal count ${proposalCount}`);
      return false;
    }
    
    const [hasVoted, voteType] = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'getVoteInfo',
      args: [proposalId, voter]
    });
    
    return hasVoted;
  } catch (error) {
    console.error('Error checking if address has voted:', error);
    return false;
  }
};

/**
 * Get voting record for an address on a proposal
 * @param {number} proposalId - The proposal ID
 * @param {string} voter - The voter address
 * @param {number} chainId - The chain ID (ignored, always using Sepolia)
 * @returns {Promise<object>} Voting record
 */
export const getVotingRecord = async (proposalId, voter, chainId) => {
  try {
    // First check if the proposalId is valid by checking the proposal count
    const proposalCount = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'proposalCount'
    });
    
    if (proposalId > Number(proposalCount)) {
      console.warn(`Proposal ID ${proposalId} is greater than the proposal count ${proposalCount}`);
      return {
        hasVoted: false,
        voteType: 0,
        support: false,
        weight: '0'
      };
    }
    
    const [hasVoted, voteType] = await publicClient.readContract({
      address: contractAddresses.governance,
      abi: OriroGovernanceABI.abi,
      functionName: 'getVoteInfo',
      args: [proposalId, voter]
    });
    
    // Here we need to estimate the weight based on token balance
    // since the getVoteInfo method doesn't return weight directly
    let weight = '0';
    if (hasVoted) {
      const tokenBalance = await publicClient.readContract({
        address: contractAddresses.token,
        abi: OriroTokenABI.abi,
        functionName: 'balanceOf',
        args: [voter]
      });
      weight = tokenBalance;
    }
    
    return {
      hasVoted,
      voteType: Number(voteType), // 0=Against, 1=For, 2=Abstain
      support: voteType === 1, // For backward compatibility
      weight: formatEther(weight)
    };
  } catch (error) {
    console.error('Error getting voting record:', error);
    return {
      hasVoted: false,
      voteType: 0,
      support: false,
      weight: '0'
    };
  }
}; 