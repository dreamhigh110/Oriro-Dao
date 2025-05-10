import { createConfig, WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import { chains, transports, projectConfig } from '../config/blockchainConfig';

// Create a wagmi config with the desired chains
const config = createConfig({
  chains,
  transports,
});

// Create a QueryClient for React Query
const queryClient = new QueryClient();

/**
 * WalletProvider component that wraps the application with RainbowKit and wagmi providers
 */
export const WalletProvider = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkMode ? darkTheme() : lightTheme()}
          appInfo={projectConfig}
          chains={chains}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider; 