import { useLocation, useNavigationType } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // ⭐ Fix: Skip scroll to top if navigation is "Back" (POP)
    if (navType === 'POP') return;

    // Performance Optimization: Wrap in requestAnimationFrame
    requestAnimationFrame(() => {
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
  }, [pathname, navType]);

  return null;
}

export default ScrollToTop;
