import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useConfig } from 'wagmi';
import { useAuth } from '../../context/AuthContext';
import './ConnectWallet.css';

const ConnectWallet = () => {
  const config = useConfig();
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { updateUserWallet } = useAuth();

  // When wallet gets connected, update the user profile
  useEffect(() => {
    if (isConnected && address) {
      updateUserWallet(address, chain?.name || 'Unknown');
    }
  }, [isConnected, address, chain, updateUserWallet]);

  return (
    <div className="connect-wallet-container">
      <ConnectButton 
        accountStatus="address"
        chainStatus="icon"
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
      <div className="wallet-info">
        {isConnected && balance && (
          <div className="balance">
            <span className="balance-amount">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet; 