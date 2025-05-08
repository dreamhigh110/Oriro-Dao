// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import ethereumLogo from '../../assets/icons/crypto/ethereum.svg';
import polygonLogo from '../../assets/icons/crypto/polygon.svg';
import bnbLogo from '../../assets/icons/crypto/bnb.svg';
import hyperledgerLogo from '../../assets/icons/crypto/hyperledger.svg';

const BlockchainSection = () => {
  const blockchains = [
    {
      name: 'Ethereum',
      logo: ethereumLogo,
      description: 'The original smart contract platform',
      features: ['Smart Contracts', 'ERC-20 Tokens', 'NFTs']
    },
    {
      name: 'Polygon',
      logo: polygonLogo,
      description: 'Scalable Ethereum sidechain',
      features: ['Low Fees', 'Fast Transactions', 'EVM Compatible']
    },
    {
      name: 'Binance Smart Chain',
      logo: bnbLogo,
      description: 'High-performance blockchain',
      features: ['Low Cost', 'Cross-Chain', 'DeFi Ecosystem']
    },
    {
      name: 'Hyperledger',
      logo: hyperledgerLogo,
      description: 'Enterprise-grade private blockchain',
      features: ['Permissioned', 'Privacy Focused', 'Enterprise Ready']
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-dark-darker relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-display font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Multi-Chain{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Infrastructure
            </span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our platform supports multiple blockchains with cross-chain bridges, 
            enabling seamless asset transfers and diverse applications.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blockchains.map((blockchain, index) => (
            <motion.div 
              key={blockchain.name}
              className="card p-6 hover:shadow-lg transition-all duration-500 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-20 w-20 mx-auto mb-6 p-4 rounded-full bg-slate-100 dark:bg-dark flex items-center justify-center">
                <img src={blockchain.logo} alt={blockchain.name} className="h-12 transition-transform group-hover:scale-110 duration-300" />
              </div>
              
              <h3 className="text-xl font-display font-bold text-center mb-3">
                {blockchain.name}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                {blockchain.description}
              </p>
              
              <div className="border-t border-slate-200 dark:border-dark pt-4">
                <ul className="space-y-2">
                  {blockchain.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </motion.div>
          ))}
        </div>

        {/* Cross-chain bridge illustration */}
        <motion.div 
          className="mt-20 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="p-8 glass-card">
            <h3 className="text-2xl font-display font-bold text-center mb-6">
              Cross-Chain <span className="text-primary">Bridge</span>
            </h3>
            
            <div className="relative py-10">
              {/* Connection lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-secondary"></div>
              
              {/* Bridge nodes */}
              <div className="flex justify-between items-center relative z-10">
                {['Ethereum', 'Bridge', 'Polygon', 'BSC'].map((node, index) => (
                  <motion.div 
                    key={node} 
                    className={`flex flex-col items-center ${index === 1 ? 'mx-auto' : ''}`}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      index === 1 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                        : 'bg-white dark:bg-dark-light shadow-md'
                    }`}>
                      {index === 1 ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 5a1 1 0 011 1v1h2V6a1 1 0 112 0v1h1a2 2 0 012 2v1h-1a1 1 0 110 2h1v2a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H6a2 2 0 01-2-2v-2H3a1 1 0 110-2h1V8a2 2 0 012-2h1V5a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="text-xl font-bold">{node[0]}</div>
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium">{node}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Animated dots on the line */}
              <motion.div 
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-lg"
                animate={{ 
                  x: ['0%', '100%'],
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  duration: 3, 
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              <motion.div 
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-secondary shadow-lg"
                animate={{ 
                  x: ['100%', '0%'],
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  duration: 3, 
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1.5
                }}
              />
            </div>
            
            <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
              Securely transfer assets between different blockchains with our Cross-Chain Bridge
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlockchainSection; 