import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import api from '../utils/api';

const FAQ = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📋' },
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'account', name: 'Account & Security', icon: '🔐' },
    { id: 'marketplace', name: 'Marketplace', icon: '🏪' },
    { id: 'staking', name: 'Staking', icon: '💰' },
    { id: 'governance', name: 'Governance', icon: '🗳️' },
    { id: 'technical', name: 'Technical', icon: '⚙️' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'What is Oriro DAO?',
      answer: 'Oriro DAO is a decentralized autonomous organization that provides a comprehensive platform for DeFi services, NFT marketplace, and blockchain governance. Our platform combines multi-chain infrastructure with user-friendly interfaces and institutional-grade security.'
    },
    {
      id: 2,
      category: 'general',
      question: 'How do I get started with Oriro DAO?',
      answer: 'Getting started is easy! Simply create an account, connect your Web3 wallet, complete the KYC verification process, and you\'ll be ready to explore our marketplace, participate in governance, and start staking.'
    },
    {
      id: 3,
      category: 'account',
      question: 'What wallets are supported?',
      answer: 'We support all major Web3 wallets including MetaMask, WalletConnect, Coinbase Wallet, and hardware wallets like Ledger and Trezor. The platform automatically detects compatible wallets in your browser.'
    },
    {
      id: 4,
      category: 'account',
      question: 'Is KYC required for all features?',
      answer: 'Basic browsing and viewing doesn\'t require KYC, but participating in governance, staking, trading, and accessing advanced features requires identity verification to comply with regulatory requirements.'
    },
    {
      id: 5,
      category: 'account',
      question: 'How secure is my account?',
      answer: 'We implement multiple security layers including 2FA, email verification, smart contract audits, and cold storage for funds. Your private keys remain in your control through your connected wallet.'
    },
    {
      id: 6,
      category: 'marketplace',
      question: 'How do I create an NFT request?',
      answer: 'Navigate to the marketplace, click "Create NFT", fill out the request form with your artwork details, upload your files, and submit for review. Our team will process your request within 48 hours.'
    },
    {
      id: 7,
      category: 'marketplace',
      question: 'What are the marketplace fees?',
      answer: 'We charge a 2.5% platform fee on successful NFT sales and a 1% fee on bond transactions. Creators earn 95% of primary sales and can set royalties for secondary sales.'
    },
    {
      id: 8,
      category: 'marketplace',
      question: 'Can I trade across different blockchains?',
      answer: 'Yes! Our multi-chain infrastructure supports trading across Ethereum, Polygon, Arbitrum, and other major networks. Cross-chain transfers are facilitated through secure bridge protocols.'
    },
    {
      id: 9,
      category: 'staking',
      question: 'How do staking rewards work?',
      answer: 'Staking rewards are distributed based on the amount of ORIRO tokens staked and the duration of your stake. Rewards are calculated daily and can be claimed at any time. Longer stakes receive bonus multipliers.'
    },
    {
      id: 10,
      category: 'staking',
      question: 'What\'s the minimum staking amount?',
      answer: 'The minimum staking amount is 100 ORIRO tokens. There\'s no maximum limit, and you can add to your stake at any time. Unstaking has a 7-day cooldown period.'
    },
    {
      id: 11,
      category: 'staking',
      question: 'Can I unstake my tokens anytime?',
      answer: 'Yes, but there\'s a 7-day unbonding period for security reasons. During this time, you won\'t earn staking rewards, but your tokens remain safe. Emergency unstaking is available with a small penalty fee.'
    },
    {
      id: 12,
      category: 'governance',
      question: 'How does voting work?',
      answer: 'Token holders can vote on proposals using their staked ORIRO tokens. We use quadratic voting to ensure fair representation and prevent whale dominance. You can also delegate your voting power to trusted community members.'
    },
    {
      id: 13,
      category: 'governance',
      question: 'Who can create proposals?',
      answer: 'Any community member who holds at least 10,000 ORIRO tokens or has received delegation of that amount can create proposals. Proposals go through a review period before voting begins.'
    },
    {
      id: 14,
      category: 'governance',
      question: 'What types of proposals can be made?',
      answer: 'Proposals can cover platform upgrades, parameter changes, treasury allocations, partnership decisions, and protocol improvements. Emergency proposals for security issues have an expedited process.'
    },
    {
      id: 15,
      category: 'technical',
      question: 'What blockchains do you support?',
      answer: 'We currently support Ethereum, Polygon, Arbitrum, and are expanding to include Solana, Avalanche, and other major blockchains. Our modular architecture allows for easy integration of new chains.'
    },
    {
      id: 16,
      category: 'technical',
      question: 'Are smart contracts audited?',
      answer: 'Yes, all our smart contracts undergo rigorous auditing by leading security firms including ConsenSys Diligence, OpenZeppelin, and Trail of Bits. Audit reports are publicly available on our website.'
    },
    {
      id: 17,
      category: 'technical',
      question: 'What happens if I encounter a bug?',
      answer: 'Report bugs through our support system or Discord community. We have a bug bounty program that rewards security researchers for finding vulnerabilities. Critical bugs are addressed within 24 hours.'
    },
    {
      id: 18,
      category: 'marketplace',
      question: 'What are bonds and how do they work?',
      answer: 'Bonds are tokenized debt instruments that offer fixed returns over specified periods. Investors can purchase bonds with various risk levels and maturities, earning predictable yields while supporting project funding.'
    },
    {
      id: 19,
      category: 'general',
      question: 'What are the supported currencies?',
      answer: 'We support major cryptocurrencies including ETH, USDC, USDT, DAI, and ORIRO tokens. Fiat on-ramp is available through partner integrations for purchasing crypto directly on the platform.'
    },
    {
      id: 20,
      category: 'account',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to your account settings, click on Security, and follow the steps to enable 2FA using an authenticator app like Google Authenticator or Authy. We highly recommend enabling 2FA for account security.'
    }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/content/faq');
      if (response.data.success) {
        setContent(response.data.data.content);
      } else {
        console.error('Failed to load FAQ content');
      }
    } catch (err) {
      console.error('Error fetching FAQ content:', err);
      // Set fallback content if API fails
      setContent(getDefaultContent());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultContent = () => {
    return `# Frequently Asked Questions

## General Questions

### What is Oriro DAO?
Oriro DAO is a decentralized autonomous organization platform...

### How do I get started?
1. Sign up for an account
2. Complete verification
3. Connect your wallet

### What fees are involved?
- Platform fee: 2.5% on trades
- Gas fees: Variable based on network

## Technical Questions

### Which wallets are supported?
We support MetaMask, WalletConnect, Coinbase Wallet, and hardware wallets.`;
  };

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl font-bold text-slate-900 dark:text-white mb-6 mt-8">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 mt-6">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium text-slate-900 dark:text-white mb-3 mt-4">{line.substring(4)}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="text-slate-700 dark:text-slate-300 ml-4">{line.substring(2)}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold text-slate-900 dark:text-white mb-2">{line.slice(2, -2)}</p>;
      } else {
        return <p key={index} className="text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{line}</p>;
      }
    });
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Find answers to common questions about the Oriro DAO platform, features, and services.
          </p>
        </div>

        {/* Database Content Section */}
        {!isLoading && content && (
          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8 mb-12">
            <div className="prose dark:prose-invert max-w-none">
              {renderMarkdown(content)}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center mb-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-dark-light border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-dark-light border border-slate-300 dark:border-dark text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-darker'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white dark:bg-dark-light rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-dark-darker transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {categories.find(cat => cat.id === faq.category)?.name}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-5 h-5 text-slate-500 transition-transform ${
                          expandedItems.has(faq.id) ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {expandedItems.has(faq.id) && (
                  <div className="px-6 pb-4 border-t border-slate-200 dark:border-dark">
                    <div className="pt-4">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Try adjusting your search terms or selecting a different category.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-white/90 mb-6">
            Our community and support team are here to help you succeed on the Oriro platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="https://discord.gg/oriro"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Join Discord
            </a>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mt-12 bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Popular Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Getting Started</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Learn how to set up your account and start using the platform
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💎</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">NFT Trading</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Discover how to buy, sell, and create NFTs on our marketplace
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏛️</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">DAO Governance</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Participate in community governance and decision-making
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 