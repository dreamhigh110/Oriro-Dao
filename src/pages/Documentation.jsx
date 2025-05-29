import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Documentation = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/content/documentation');
      if (response.data.success) {
        setContent(response.data.data.content);
      } else {
        setError('Failed to load documentation content');
      }
    } catch (err) {
      console.error('Error fetching documentation content:', err);
      // Fallback to static content if API fails
      setContent(getDefaultContent());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultContent = () => {
    return `# Platform Documentation

Welcome to the Oriro DAO documentation. This comprehensive guide will help you understand and use our platform effectively.

## Getting Started
1. Create your account
2. Complete KYC verification
3. Connect your wallet
4. Start exploring the platform

## Features
- NFT Marketplace
- Bond Trading
- Staking Rewards

## Support
If you need help, contact our support team at support@oriro.org`;
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

  const docSections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using Oriro DAO',
      items: [
        { title: 'Platform Overview', href: '#overview' },
        { title: 'Creating an Account', href: '#account' },
        { title: 'Connecting Your Wallet', href: '#wallet' },
        { title: 'Completing KYC', href: '#kyc' },
      ]
    },
    {
      title: 'Marketplace',
      description: 'NFTs and bonds trading',
      items: [
        { title: 'Browsing NFTs', href: '#browsing' },
        { title: 'Creating NFT Requests', href: '#nft-requests' },
        { title: 'Understanding Bonds', href: '#bonds' },
        { title: 'Bond Investment Guide', href: '#bond-investment' },
      ]
    },
    {
      title: 'Staking',
      description: 'Earn rewards through staking',
      items: [
        { title: 'Staking Basics', href: '#staking-basics' },
        { title: 'Reward Calculation', href: '#rewards' },
        { title: 'Unstaking Process', href: '#unstaking' },
        { title: 'Slashing Conditions', href: '#slashing' },
      ]
    },
    {
      title: 'API Integration',
      description: 'Technical integration guides',
      items: [
        { title: 'API Overview', href: '#api-overview' },
        { title: 'Authentication', href: '#authentication' },
        { title: 'Rate Limits', href: '#rate-limits' },
        { title: 'Webhooks', href: '#webhooks' },
      ]
    },
    {
      title: 'Security',
      description: 'Best practices and security',
      items: [
        { title: 'Wallet Security', href: '#wallet-security' },
        { title: 'Two-Factor Authentication', href: '#2fa' },
        { title: 'Phishing Protection', href: '#phishing' },
        { title: 'Audit Reports', href: '#audits' },
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Documentation</h1>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Documentation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Comprehensive guides and documentation to help you understand and use the Oriro DAO platform effectively.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-dark-light border border-slate-300 dark:border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {docSections.map((section, index) => (
            <div key={index} className="bg-white dark:bg-dark-light rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {section.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {section.description}
              </p>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.href}
                      className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Database Content Section */}
        <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8 mb-12">
          <div className="prose dark:prose-invert max-w-none">
            {renderMarkdown(content)}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quick Start Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Sign Up</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Create your Oriro DAO account</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Connect Wallet</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Link your Web3 wallet</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Complete KYC</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Verify your identity</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Start Trading</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Explore the marketplace</p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
          <p className="text-white/90 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/support"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation; 