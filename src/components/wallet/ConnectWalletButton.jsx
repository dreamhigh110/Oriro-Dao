import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useAuth } from '../../context/AuthContext';

/**
 * ConnectWalletButton component that provides a button to connect to a wallet
 * and syncs the connected wallet address with the user's profile
 */
const ConnectWalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connectWallet, currentUser } = useAuth();

  // When wallet gets connected, update the user profile
  useEffect(() => {
    if (isConnected && address && currentUser) {
      // Only update if there's a logged-in user
      connectWallet(address).catch(err => {
        console.log('Error connecting wallet to user profile:', err);
      });
    }
  }, [isConnected, address, connectWallet, currentUser]);

  return <ConnectButton />;
};

export default ConnectWalletButton; 