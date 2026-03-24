import React, { useEffect, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import QuoteModal from '@/components/QuoteModal';

// 🚀 Performance: Lazy load "Below the Fold" components to drastically reduce index.js size
const AboutSection = React.lazy(() => import('@/components/AboutSection'));
const FeaturedCategories = React.lazy(() => import('@/components/FeaturedCategories'));

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
          {/* Hero is critical path (LCP) -> Keep synchronous */}
          <HeroCarousel />
          
          {/* Below the fold -> Defer network load until after Hero renders */}
          <Suspense fallback={<div className="h-96 w-full flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin"></div></div>}>
            <AboutSection />
            <FeaturedCategories />
          </Suspense>
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
