import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Standard window scroll for public pages
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant', // Instant is best for performance during navigation
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }

    // Elite Touch: Agar kisi element mein internal scroll hai (jaise dashboard sidebar), 
    // toh use bhi reset karne ke liye niche wala logic use hota hai
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;