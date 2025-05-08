// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  CubeTransparentIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  BuildingLibraryIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      icon: <CubeTransparentIcon className="h-10 w-10" />,
      title: 'Multi-Chain Infrastructure',
      description: 'Support for Ethereum, Polygon, BSC, and custom private chains with secure cross-chain bridges.'
    },
    {
      icon: <ShieldCheckIcon className="h-10 w-10" />,
      title: 'Secure Governance',
      description: 'Custom DAO smart contracts for transparent, secure voting and governance processes.'
    },
    {
      icon: <CurrencyDollarIcon className="h-10 w-10" />,
      title: 'Token & Bond Issuance',
      description: 'Create, manage, and trade custom tokens, NFTs, and private bonds with real-world asset backing.'
    },
    {
      icon: <DocumentTextIcon className="h-10 w-10" />,
      title: 'Smart Contracts',
      description: 'Custom smart contracts for staking, token issuance, and blockchain payment orchestration.'
    },
    {
      icon: <BuildingLibraryIcon className="h-10 w-10" />,
      title: 'Digital Banking',
      description: 'Virtual IBANs, digital wallets, and payment cards linked to blockchain assets.'
    },
    {
      icon: <LockClosedIcon className="h-10 w-10" />,
      title: 'Privacy & Compliance',
      description: 'Multi-Party Computation for secure custody with manual KYC approval system.'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-dark-darker relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-100 to-white dark:from-dark dark:to-dark-darker"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-100 to-white dark:from-dark dark:to-dark-darker"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-display font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Advanced Platform{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Features
            </span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Oriro combines blockchain technology with traditional finance to create a secure, 
            private ecosystem for decentralized asset management.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="card p-8 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
              variants={itemVariants}
            >
              {/* Gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon with gradient background */}
              <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-100 dark:bg-dark mb-6 text-primary group-hover:text-secondary transition-colors duration-300">
                {feature.icon}
              </div>
              
              <h3 className="relative z-10 text-xl font-display font-bold mb-3">
                {feature.title}
              </h3>
              
              <p className="relative z-10 text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 