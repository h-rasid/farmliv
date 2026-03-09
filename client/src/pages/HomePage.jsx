import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import AboutSection from '@/components/AboutSection';
import FeaturedCategories from '@/components/FeaturedCategories';
import QuoteModal from '@/components/QuoteModal';

const HomePage = () => {
  const location = useLocation();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('quote') === 'general') {
      setIsQuoteModalOpen(true);
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>Farmliv Industries - Premium B2B Agricultural Solutions | Quality Products for Modern Farming</title>
        <meta name="description" content="Leading B2B supplier of agricultural products including weed control mats, shade nets, drip irrigation, and mulch films. ISO certified quality, Your trusted partner for business solutions." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main>
          <HeroCarousel />
          <AboutSection />
          <FeaturedCategories />
        </main>

        <Footer />

        <QuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={() => setIsQuoteModalOpen(false)} 
        />
      </div>
    </>
  );
};

export default HomePage;