import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ConnectWallet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { connectWallet } = useAuth();
  const navigate = useNavigate();

  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect with your MetaMask wallet'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Scan a QR code to connect'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🪙',
      description: 'Connect with Coinbase Wallet'
    },
    {
      id: 'ledger',
      name: 'Ledger',
      icon: '🔒',
      description: 'Connect with your hardware wallet'
    }
  ];

  const handleConnectWallet = async (providerId) => {
    try {
      setLoading(true);
      setError('');
      
      // In a real app, this would use providerId to connect to the specific wallet
      console.log(`Connecting to wallet provider: ${providerId}`);
      
      // For demo purposes, we'll just simulate connecting
      await connectWallet();
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold">Connect Your Wallet</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Connect your wallet to start using Oriro's blockchain features. Choose from the following wallet options:
        </p>
      </div>

      {error && (
        <div className="mt-8 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {walletProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleConnectWallet(provider.id)}
            disabled={loading}
            className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-dark-darker hover:shadow-md transition-shadow flex items-center text-left"
          >
            <div className="text-4xl mr-4">{provider.icon}</div>
            <div>
              <h3 className="font-medium">{provider.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{provider.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          New to blockchain? <a href="https://ethereum.org/wallets/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn more about wallets</a>
        </p>
      </div>
    </div>
  );
};

export default ConnectWallet; 