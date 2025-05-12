import React, { useEffect, useRef } from 'react';
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
  const lastConnectedAddress = useRef(null);

  // When wallet gets connected or changes, update the user profile
  useEffect(() => {
    // Only update if there's a logged-in user, a connected wallet, and the address has changed
    if (isConnected && address && currentUser && 
        address !== lastConnectedAddress.current && 
        address !== currentUser.walletAddress) {
      
      console.log('Wallet address changed, updating profile');
      
      // Update the reference to avoid unnecessary API calls
      lastConnectedAddress.current = address;
      
      // Send the update to the server
      connectWallet(address).catch(err => {
        console.log('Error connecting wallet to user profile:', err);
      });
    }
  }, [isConnected, address, connectWallet, currentUser]);

  return <ConnectButton />;
};

export default ConnectWalletButton; 