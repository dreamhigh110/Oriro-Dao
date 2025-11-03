import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useBalance, useConfig, usePublicClient, useBlockNumber, useWalletClient } from 'wagmi';
import { getTokenBalance, getTotalSupply } from '../services/contractService';
import { useAuth } from './AuthContext';

const BlockchainContext = createContext();

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
  const config = useConfig();
  const { address, isConnected, chain } = useAccount();
  const { currentUser } = useAuth();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { data: nativeBalance, isLoading: loadingNativeBalance } = useBalance({
    address,
    watch: true,
  });

  // State variables
  const [tokenBalance, setTokenBalance] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');
  const [loadingTokenData, setLoadingTokenData] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [lastBlockNumber, setLastBlockNumber] = useState(0);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [transactionPending, setTransactionPending] = useState(false);

  // Watch for new blocks to refresh data
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  useEffect(() => {
    if (blockNumber) {
      setLastBlockNumber(Number(blockNumber));
    }
  }, [blockNumber]);

  // Check if user is on the correct network (Sepolia)
  useEffect(() => {
    if (isConnected && chain) {
      // Check if on Sepolia or other supported chains
      const supportedChains = [11155111]; // Sepolia
      setIsCorrectNetwork(supportedChains.includes(chain.id));
    }
  }, [chain, isConnected]);

  // Load token data when chain, address or block number changes
  useEffect(() => {
    const loadTokenData = async () => {
      if (!isConnected || !chain || !address) return;

      try {
        setLoadingTokenData(true);
        setTokenError('');

        // Load token balance and total supply in parallel
        const [balance, supply] = await Promise.all([
          getTokenBalance(address, chain.id),
          getTotalSupply(chain.id)
        ]);

        setTokenBalance(balance);
        setTotalSupply(supply);
      } catch (error) {
        console.error('Error loading token data:', error);
        setTokenError('Failed to load token data');
        // Set defaults in case of error
        setTokenBalance('0');
        setTotalSupply('0');
      } finally {
        setLoadingTokenData(false);
      }
    };

    loadTokenData();
  }, [chain, address, isConnected, lastBlockNumber]);

  // Format native balance for display
  const formattedNativeBalance = nativeBalance 
    ? `${parseFloat(nativeBalance.formatted).toFixed(4)} ${nativeBalance.symbol}`
    : '0';
  
  // Refresh token data manually
  const refreshTokenData = async () => {
    if (!isConnected || !chain || !address) return;

    try {
      setLoadingTokenData(true);
      setTokenError('');

      const [balance, supply] = await Promise.all([
        getTokenBalance(address, chain.id),
        getTotalSupply(chain.id)
      ]);

      setTokenBalance(balance);
      setTotalSupply(supply);
    } catch (error) {
      console.error('Error refreshing token data:', error);
      setTokenError('Failed to refresh token data');
    } finally {
      setLoadingTokenData(false);
    }
  };

  /**
   * Execute a transaction using the wallet
   * @param {object} txData - Transaction data object
   * @returns {Promise<string>} Transaction hash
   */
  const executeTransaction = async (txData) => {
    if (!walletClient || !isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to the correct network');
    }

    try {
      setTransactionPending(true);
      
      // Execute the transaction
      const hash = await walletClient.writeContract(txData);
      
      // Wait for the transaction to be confirmed
      await publicClient.waitForTransactionReceipt({ hash });
      
      // Return the transaction hash
      return hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      setTransactionPending(false);
    }
  };

  // The context value
  const value = {
    // Network info
    chainId: chain?.id,
    chainName: chain?.name,
    isConnected,
    walletAddress: address,
    isCorrectNetwork,
    
    // Token data
    tokenBalance,
    totalSupply,
    nativeBalance: formattedNativeBalance,
    tokens: [
      {
        address: '0x123...', // Replace with actual token address
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18
      },
      {
        address: '0x456...', // Replace with actual token address
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6
      }
    ],
    
    // Loading states
    loadingTokenData,
    loadingNativeBalance,
    transactionPending,
    
    // Errors
    tokenError,
    
    // Methods
    refreshTokenData,
    executeTransaction,

    // Raw data
    nativeBalanceRaw: nativeBalance,
    
    // Block data
    lastBlockNumber
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContext; 