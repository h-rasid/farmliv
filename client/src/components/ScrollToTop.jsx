import { useLocation, useNavigationType } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // ⭐ Fix: Skip scroll to top if navigation is "Back" (POP)
    if (navType === 'POP') return;

    const mainContent = document.querySelector('main');
    
    requestAnimationFrame(() => {
      // ⭐ Optimized: Single call to window.scrollTo
      window.scrollTo(0, 0);

      if (mainContent) {
        mainContent.scrollTo(0, 0);
      }
    });
  }, [pathname, navType]);

  return null;
}

export default ScrollToTop;
