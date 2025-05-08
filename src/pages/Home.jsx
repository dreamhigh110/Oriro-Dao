import { useEffect } from 'react';
import Hero from '../components/common/Hero';
import Features from '../components/common/Features';
import MarketplacePreview from '../components/common/MarketplacePreview';
import BlockchainSection from '../components/common/BlockchainSection';
import CtaSection from '../components/common/CtaSection';

const Home = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Hero />
      <Features />
      <MarketplacePreview />
      <BlockchainSection />
      <CtaSection />
    </div>
  );
};

export default Home; 