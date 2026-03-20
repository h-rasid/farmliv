import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // ⭐ Performance Optimization: Wrap in requestAnimationFrame to prevent forced reflow
    // during route transitions when DOM might still be updating.
    requestAnimationFrame(() => {
      // Standard window scroll for public pages
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      } catch (error) {
        window.scrollTo(0, 0);
      }

      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTo(0, 0);
      }
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;