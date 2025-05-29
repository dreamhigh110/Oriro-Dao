import { mainnet, polygon, bsc, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Configure the chains to be used by the application
export const chains = [
  mainnet,
  polygon,
  bsc,
  sepolia, // Include a testnet for development
];

// Default chain for connecting if not specified
export const defaultChain = sepolia;

// RPC configuration for each chain
export const rpcConfig = {
  [mainnet.id]: {
    // rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/W05ZYjsQKEgRWEHRo1fYmPltz7_bpw1s',
    rpcUrl: 'https://sepolia.drpc.org',
    name: 'Ethereum',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [polygon.id]: {
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/W05ZYjsQKEgRWEHRo1fYmPltz7_bpw1s',
    name: 'Polygon',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  [bsc.id]: {
    rpcUrl: 'https://bsc-dataseed.binance.org',
    name: 'BNB Smart Chain',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  [sepolia.id]: {
    // rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/W05ZYjsQKEgRWEHRo1fYmPltz7_bpw1s',
    rpcUrl: 'https://sepolia.drpc.org',
    name: 'Sepolia Testnet',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

// Configure transport for each chain
export const transports = {
  [mainnet.id]: http(rpcConfig[mainnet.id].rpcUrl),
  [polygon.id]: http(rpcConfig[polygon.id].rpcUrl),
  [bsc.id]: http(rpcConfig[bsc.id].rpcUrl),
  [sepolia.id]: http(rpcConfig[sepolia.id].rpcUrl),
};

// Project information for displaying in WalletConnect
export const projectConfig = {
  name: 'Oriro DAO',
  description: 'A private decentralized DAO platform',
  url: 'https://oriro.org',
  icons: ['https://oriro.org/favicon.ico'],
}; 