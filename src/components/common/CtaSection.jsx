import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const CtaSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-0"></div>
      
      {/* Geometric patterns for visual interest */}
      <div className="absolute inset-0 z-10 opacity-10">
        <div className="absolute top-0 right-0 w-80 h-80 border-4 border-white rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 border-4 border-white rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/20 rounded-xl transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white/20 rounded-xl transform rotate-12"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-8">
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ready to join the next generation of 
              <span className="block">decentralized finance?</span>
            </motion.h2>
            
            <motion.p 
              className="mt-6 text-lg text-white/90 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Start your journey with Oriro today. Get access to our secure multi-chain platform, 
              participate in governance, and discover new financial opportunities.
            </motion.p>
            
            <motion.ul 
              className="mt-8 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                'Secure self-custody with Multi-Party Computation',
                'Trade and invest in tokens, NFTs, and bonds',
                'Participate in DAO governance and voting',
                'Access banking services with digital IBANs'
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                >
                  <svg className="h-6 w-6 text-white mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-white dark:bg-dark-light rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-4">
                Get Started Now
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Create your account to access the Oriro platform and all its features.
              </p>
              
              <div className="space-y-4">
                <Link 
                  to="/register" 
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Create Account
                </Link>
                
                <Link 
                  to="/connect" 
                  className="w-full py-3 px-4 bg-white dark:bg-dark border border-slate-300 dark:border-slate-600 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Connect Wallet
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/90 text-sm text-center mb-4">Trusted by organizations worldwide</p>
              <div className="flex justify-around">
                <div className="w-8 h-8 bg-white/90 rounded-full"></div>
                <div className="w-8 h-8 bg-white/90 rounded-full"></div>
                <div className="w-8 h-8 bg-white/90 rounded-full"></div>
                <div className="w-8 h-8 bg-white/90 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 