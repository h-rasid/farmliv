import { useLocation, useNavigationType } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const ScrollToTop = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const currentKey = useRef(location.key);

  // Keep track of scroll position for the current route
  useEffect(() => {
    currentKey.current = location.key;
    
    // We throttle the scroll event slightly to avoid performance hits
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        try {
          const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
          // Save the scroll position bound to the current history key
          positions[currentKey.current] = window.scrollY;
          sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
        } catch (e) {
          console.error('Failed to save scroll position', e);
        }
        scrollTimeout = null;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [location.key]);

  // Handle restoring scroll or scrolling to top
  useEffect(() => {
    if (navType !== 'POP') {
      // Normal navigation (PUSH/REPLACE): scroll to top immediately
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const mainContent = document.querySelector('main');
      if (mainContent) mainContent.scrollTo(0, 0);
      return;
    }

    // It's a POP (Back/Forward) navigation
    try {
      const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
      const savedY = positions[location.key];
      
      if (savedY !== undefined) {
        let isUserScrolling = false;
        
        // Stop attempting to auto-scroll if the user starts scrolling manually
        const handleUserIntervention = () => {
          isUserScrolling = true;
        };
        
        window.addEventListener('wheel', handleUserIntervention, { once: true, passive: true });
        window.addEventListener('touchstart', handleUserIntervention, { once: true, passive: true });

        const tryScroll = () => {
          if (!isUserScrolling) {
            window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
          }
        };

        // Attempt initially
        tryScroll();

        // Use ResizeObserver to detect when async content (like products) pushes the page height down
        const observer = new ResizeObserver(() => {
          if (isUserScrolling) {
            observer.disconnect();
            return;
          }
          tryScroll();
          
          // If we successfully scrolled to the target position, or close to it, stop observing
          if (Math.abs(window.scrollY - savedY) <= 10) {
            observer.disconnect();
          }
        });
        
        observer.observe(document.body);

        // Safety cleanup after 2 seconds (content should have loaded by then)
        const timeoutId = setTimeout(() => {
          observer.disconnect();
          window.removeEventListener('wheel', handleUserIntervention);
          window.removeEventListener('touchstart', handleUserIntervention);
        }, 2000);

        return () => {
          observer.disconnect();
          clearTimeout(timeoutId);
          window.removeEventListener('wheel', handleUserIntervention);
          window.removeEventListener('touchstart', handleUserIntervention);
        };
      }
    } catch (e) {
      console.error('Failed to restore scroll position', e);
    }
  }, [location.key, navType]);

  return null;
}

export default ScrollToTop;