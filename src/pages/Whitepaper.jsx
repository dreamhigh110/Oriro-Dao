import React, { useState, useEffect } from 'react';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import api from '../utils/api';

const Whitepaper = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/content/whitepaper');
      if (response.data.success) {
        setContent(response.data.data.content);
      } else {
        setError('Failed to load whitepaper content');
      }
    } catch (err) {
      console.error('Error fetching whitepaper content:', err);
      // Fallback to static content if API fails
      setContent(getDefaultContent());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultContent = () => {
    return `# Oriro DAO Whitepaper
**A Decentralized Autonomous Organization for Multi-Chain DeFi and NFT Marketplace**

## 1. Abstract

Oriro DAO represents a revolutionary approach to decentralized autonomous organizations, combining multi-chain infrastructure with comprehensive DeFi services and NFT marketplace functionality. Our platform addresses the growing need for accessible, secure, and user-friendly blockchain applications while maintaining the principles of decentralization and community governance.

This whitepaper outlines the technical architecture, governance model, tokenomics, and roadmap for the Oriro DAO ecosystem, demonstrating how we aim to bridge the gap between traditional finance and the emerging DeFi landscape.

## 2. Introduction

The decentralized finance (DeFi) ecosystem has experienced unprecedented growth, with total value locked (TVL) reaching hundreds of billions of dollars. However, this growth has highlighted several critical challenges including user experience complexity, security vulnerabilities, and governance inefficiencies.

Oriro DAO emerges as a solution to these challenges, providing a comprehensive platform that combines the benefits of decentralized governance with user-friendly interfaces and institutional-grade security measures.

## 3. Problem Statement

### 3.1 User Experience Barriers
Current DeFi platforms often suffer from complex user interfaces, high gas fees, and fragmented experiences across multiple chains.

### 3.2 Governance Inefficiencies
Many DAOs struggle with low voter participation, plutocratic tendencies, and slow decision-making processes.

### 3.3 Security Concerns
Smart contract vulnerabilities and bridge exploits have resulted in billions of dollars in losses, undermining user confidence.

## 4. Solution Overview

Oriro DAO addresses these challenges through a comprehensive platform featuring:

- **Multi-chain architecture** enabling seamless cross-chain operations
- **Intuitive user interface** designed for both beginners and advanced users
- **Robust governance system** with quadratic voting and delegation mechanisms
- **Security-first approach** with multiple audits and insurance coverage
- **Integrated marketplace** for NFTs and tokenized bonds

## 5. Technical Architecture

### 5.1 Multi-Chain Infrastructure
Our platform is built on a modular architecture supporting Ethereum, Polygon, Arbitrum, and other major blockchains. Cross-chain operations are facilitated through secure bridge protocols and layer-2 scaling solutions.

### 5.2 Smart Contract Design
All smart contracts are developed using industry best practices, including formal verification, comprehensive testing, and multiple security audits. The modular design allows for upgradability while maintaining security.

### 5.3 Oracle Integration
Price feeds and external data are sourced through multiple oracle providers including Chainlink, Band Protocol, and custom oracle solutions to ensure data reliability and prevent manipulation.

## 6. Governance Model

Oriro DAO implements a sophisticated governance system designed to ensure fair representation, efficient decision-making, and long-term sustainability.

### Quadratic Voting
Reduces the influence of large token holders and increases representation of smaller stakeholders.

### Delegation System
Allows token holders to delegate voting power to trusted community members or experts.

### Time-locked Proposals
Critical changes include mandatory waiting periods for community review and preparation.

### Multi-stage Voting
Complex proposals undergo multiple voting stages to ensure thorough consideration.

## 7. Tokenomics

### 7.1 ORIRO Token
The ORIRO token serves as the native governance and utility token of the Oriro DAO ecosystem. Token holders can participate in governance decisions, access platform features, and earn rewards through staking.

**Token Distribution:**
- Community & Ecosystem: 40%
- Team & Advisors: 20%
- Treasury: 15%
- Public Sale: 15%
- Private Sale: 10%

### 7.2 Staking Rewards
Token holders can stake ORIRO tokens to earn rewards, participate in governance, and secure the network. Staking rewards are distributed based on the amount staked and the duration of the stake.

## 8. Marketplace Design

The Oriro marketplace provides a unified platform for trading NFTs and tokenized bonds, featuring advanced discovery mechanisms, secure transactions, and fair pricing algorithms.

### NFT Marketplace
- Multi-format support (images, videos, 3D models)
- Creator royalties and revenue sharing
- Rarity scoring and collection analytics
- Cross-chain NFT transfers

### Bond Marketplace
- Tokenized bond issuance and trading
- Automated yield calculations
- Risk assessment and rating system
- Secondary market liquidity

## 9. Security Model

Security is paramount in the Oriro DAO ecosystem. We implement a multi-layered security approach including smart contract audits, formal verification, and insurance coverage.

### Smart Contract Security
Multiple audits by leading security firms and ongoing bug bounty programs.

### Infrastructure Security
Decentralized infrastructure with redundancy and automated monitoring systems.

### Insurance Coverage
Comprehensive insurance coverage for smart contract risks and operational failures.

## 10. Roadmap

### Q1 2024 - Foundation
Platform launch, basic governance implementation, NFT marketplace

### Q2 2024 - Expansion
Bond marketplace, staking rewards, multi-chain support

### Q3 2024 - Advanced Features
Advanced governance, yield farming, insurance integration

### Q4 2024 - Ecosystem Growth
Partner integrations, mobile app, institutional features

## 11. Conclusion

Oriro DAO represents a significant advancement in decentralized finance and governance technology. By addressing the key challenges facing current DeFi platforms, we aim to create a more accessible, secure, and user-friendly ecosystem for the next generation of blockchain applications.

Our commitment to security, innovation, and community governance positions Oriro DAO as a leader in the evolving landscape of decentralized autonomous organizations. We invite developers, investors, and users to join us in building the future of decentralized finance.`;
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
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Whitepaper</h1>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Oriro DAO Whitepaper
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-6">
            A Decentralized Autonomous Organization for Multi-Chain DeFi and NFT Marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <FiDownload className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button className="flex items-center space-x-2 bg-white dark:bg-dark-light border border-slate-300 dark:border-dark text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-darker px-6 py-3 rounded-lg font-semibold transition-colors">
              <FiShare2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
          <div className="prose dark:prose-invert max-w-none">
            {renderMarkdown(content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper; 