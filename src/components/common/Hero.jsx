import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block">Private Decentralized</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient-x">
                DAO Platform
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Secure multi-chain infrastructure with governance, digital banking integration, 
              and a marketplace for tokens, NFTs, and bonds. Built for privacy and security.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/dashboard" className="btn btn-primary">
                Enter Platform
              </Link>
              <Link to="/docs" className="btn btn-outline">
                Learn More
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex items-center space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-dark-darker bg-primary-${i % 2 ? 'light' : 'dark'}`} />
                ))}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold">500+</span> users already joined
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right content - 3D illustrative element */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main card */}
              <motion.div 
                className="glass-card p-8 relative z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 6,
                  ease: "easeInOut" 
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                    <div className="ml-4">
                      <div className="font-medium">Oriro DAO</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Decentralized Governance</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">100 ORIRO</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">+5.4% today</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-200 dark:bg-dark rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary"></div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span>Staking Rewards</span>
                    <span>12.5% APY</span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-dark">
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>Platform Status</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-6 -left-6 w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-xl z-10"
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.05, 1, 0.95, 1] 
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 10,
                  ease: "easeInOut" 
                }}
              />
              
              <motion.div 
                className="absolute -bottom-8 -right-8 w-24 h-24 bg-secondary/20 dark:bg-secondary/30 rounded-full z-10"
                animate={{ 
                  scale: [1, 1.1, 1, 0.9, 1] 
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 8,
                  ease: "easeInOut" 
                }}
              />
              
              <motion.div 
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-dark-light rounded-lg shadow-lg z-30 flex items-center justify-center"
                animate={{ 
                  x: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 5,
                  ease: "easeInOut" 
                }}
              >
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Ω
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-1/3 -left-4 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-dark-light rounded-lg shadow-lg z-30 flex items-center justify-center"
                animate={{ 
                  x: [0, 10, 0],
                  rotate: [0, -5, 0, 5, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 7,
                  ease: "easeInOut" 
                }}
              >
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  ₿
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 