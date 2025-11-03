import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

// Initialize public client
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// Token ABIs
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
];

// Get token information
export const getTokenInfo = async (tokenAddress) => {
  try {
    // Read token info from contract
    const [name, symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'name'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'symbol'
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals'
      })
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return null;
  }
};

// Get token balance
export const getTokenBalance = async (tokenAddress, userAddress) => {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress]
    });

    return balance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return null;
  }
};

// Get token allowance
export const getTokenAllowance = async (tokenAddress, ownerAddress, spenderAddress) => {
  try {
    const allowance = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [ownerAddress, spenderAddress]
    });

    return allowance;
  } catch (error) {
    console.error('Error getting token allowance:', error);
    return null;
  }
};

// Get supported tokens
export const getSupportedTokens = () => {
  return [
    {
      address: '0x123...', // Replace with actual ETH address
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    },
    {
      address: '0x456...', // Replace with actual USDT address
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6
    }
  ];
}; 