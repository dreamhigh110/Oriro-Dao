import { useEffect, useState } from 'react';
import api from '../utils/api';
import Hero from '../components/common/Hero';
import Features from '../components/common/Features';
import MarketplacePreview from '../components/common/MarketplacePreview';
import BlockchainSection from '../components/common/BlockchainSection';
import CtaSection from '../components/common/CtaSection';

const Home = () => {
  const [homepageSettings, setHomepageSettings] = useState({
    hero: true,
    features: true,
    marketplacePreview: true,
    blockchainSection: false,
    ctaSection: true
  });
  const [loading, setLoading] = useState(true);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch homepage settings
  useEffect(() => {
    const fetchHomepageSettings = async () => {
      try {
        const response = await api.get('/homepage-settings');
        if (response.data.success) {
          setHomepageSettings(response.data.homepageSettings);
        }
      } catch (error) {
        console.error('Error fetching homepage settings:', error);
        // Use default settings if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {homepageSettings.hero && <Hero />}
      {homepageSettings.features && <Features />}
      {homepageSettings.marketplacePreview && <MarketplacePreview />}
      {homepageSettings.blockchainSection && <BlockchainSection />}
      {homepageSettings.ctaSection && <CtaSection />}
    </div>
  );
};

export default Home; 