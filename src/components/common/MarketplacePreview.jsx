import { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import logoSvg from '../../assets/icons/logo.svg';
import bitcoinLogo from '../../assets/icons/crypto/bitcoin.svg';
import ethereumLogo from '../../assets/icons/crypto/ethereum.svg';

const MarketplacePreview = () => {
  const [activeTab, setActiveTab] = useState('tokens');
  
  const tabs = [
    { id: 'tokens', label: 'Tokens' },
    { id: 'nfts', label: 'NFTs' },
    { id: 'bonds', label: 'Bonds' }
  ];
  
  const items = {
    tokens: [
      {
        id: 1,
        name: 'ORIRO',
        image: logoSvg,
        price: '$54.28',
        change: '+5.4%',
        positive: true,
        supply: '10,000,000',
        category: 'Governance'
      },
      {
        id: 2,
        name: 'BTCW',
        image: bitcoinLogo,
        price: '$65,402.91',
        change: '+2.1%',
        positive: true,
        supply: '21,000,000',
        category: 'Wrapped'
      },
      {
        id: 3,
        name: 'ETHW',
        image: ethereumLogo,
        price: '$3,452.17',
        change: '-0.8%',
        positive: false,
        supply: '120,298,041',
        category: 'Wrapped'
      },
      {
        id: 4,
        name: 'ORAS',
        image: logoSvg,
        price: '$12.75',
        change: '+8.3%',
        positive: true,
        supply: '5,000,000',
        category: 'Stablecoin'
      }
    ],
    nfts: [
      {
        id: 1,
        name: 'Digital Real Estate #128',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        price: '$250,000',
        creator: 'RealEstateDAO',
        tokenId: '#128',
        category: 'Real Estate'
      },
      {
        id: 2,
        name: 'Corporate Bond Certificate',
        image: 'https://images.unsplash.com/photo-1579532536935-619928decd08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        price: '$100,000',
        creator: 'Corporate Finance',
        tokenId: '#045',
        category: 'Financial'
      },
      {
        id: 3,
        name: 'Renewable Energy Project',
        image: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        price: '$75,000',
        creator: 'GreenEnergyDAO',
        tokenId: '#312',
        category: 'Energy'
      },
      {
        id: 4,
        name: 'Luxury Watch Certificate',
        image: 'https://images.unsplash.com/photo-1548171129-2cf6d3a2c540?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        price: '$35,000',
        creator: 'LuxuryItems',
        tokenId: '#089',
        category: 'Luxury'
      }
    ],
    bonds: [
      {
        id: 1,
        name: 'Corporate Bond A',
        image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        yield: '5.2%',
        maturity: '3 years',
        price: '$10,000',
        issuer: 'Tech Industries Inc.',
        rating: 'A+'
      },
      {
        id: 2,
        name: 'Government Treasury',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        yield: '2.8%',
        maturity: '10 years',
        price: '$5,000',
        issuer: 'Federal Treasury',
        rating: 'AAA'
      },
      {
        id: 3,
        name: 'Real Estate Bond',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        yield: '6.5%',
        maturity: '5 years',
        price: '$25,000',
        issuer: 'Property Investments LLC',
        rating: 'BBB+'
      },
      {
        id: 4,
        name: 'Green Energy Bond',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        yield: '4.9%',
        maturity: '7 years',
        price: '$15,000',
        issuer: 'Renewable Energy Corp',
        rating: 'A'
      }
    ]
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  // Render specific item based on tab
  const renderItem = (item, type) => {
    switch (type) {
      case 'tokens':
        return (
          <div className="card group hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{item.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{item.price}</div>
                  <div className={`text-xs ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-dark flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Supply</span>
                  <div className="font-medium">{item.supply}</div>
                </div>
                <button className="p-2 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary dark:bg-dark dark:hover:bg-primary/20 transition-colors">
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'nfts':
        return (
          <div className="card group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-sm">Created by {item.creator}</div>
                <div className="text-xs">Token ID: {item.tokenId}</div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold text-lg truncate">{item.name}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-dark px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-bold text-primary">{item.price}</div>
                <button className="px-3 py-1 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'bonds':
        return (
          <div className="card group hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-300" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 dark:bg-dark-darker/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-bold text-primary">{item.yield} Yield</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-dark">
                  {item.rating}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Issuer</span>
                  <span className="font-medium">{item.issuer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Maturity</span>
                  <span className="font-medium">{item.maturity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Price</span>
                  <span className="font-medium">{item.price}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-dark relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-display font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore The{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Marketplace
            </span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover and trade tokens, NFTs, and bonds backed by real-world assets 
            in our secure and private marketplace.
          </motion.p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-dark rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-dark-light shadow-sm text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items[activeTab].map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                {renderItem(item, activeTab)}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link 
            to="/marketplace" 
            className="btn btn-outline group"
          >
            <span>View All Marketplace Items</span>
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview; 