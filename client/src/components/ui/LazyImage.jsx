import React, { useState, useEffect, useRef, useCallback } from 'react';

const LazyImage = ({ src, alt, className, priority = false, aspectRatio = '16/9' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false); 
  const imgRef = useRef(null);

  // ⭐ Memoized handler to prevent re-renders
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        // rootMargin: 200px user ke scroll karne se thoda pehle hi trigger karega
        rootMargin: '200px', 
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // ⭐ Helper to inject Cloudinary optimization parameters
  const getOptimizedUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      // Avoid double injection
      if (url.includes('f_auto') || url.includes('q_auto')) return url;
      
      // Advanced Optimization: Automatic format, dynamic quality (eco for savings), and responsive width
      // c_limit ensures we don't upscale, but downscale for large originals
      let params = 'f_auto,q_auto:eco,c_limit';
      if (priority) {
        params = 'f_auto,q_auto,c_limit,w_1920'; // High quality for hero images but capped at 1920px
      } else {
        params = 'f_auto,q_auto:eco,c_limit,w_1000'; // Eco quality and capped at 1000px for secondary images
      }
      
      return url.replace('/upload/', `/upload/${params}/`);
    }
    return url;
  };

  const optimizedSrc = getOptimizedUrl(src);

  return (
    <div 
      ref={imgRef} 
      /* ⭐ 'will-change-transform' Hardware Acceleration provide karta hai */
      className={`relative overflow-hidden bg-slate-50 will-change-transform ${className}`}
      style={{ aspectRatio }} 
    >
      {/* Placeholder Loading Spinner */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse z-10">
          <div className="w-8 h-8 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin" />
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-[10px] lg:text-xs text-center p-2 font-medium">
          <div className="flex flex-col items-center">
            <span>⚠️ Image Unavailable</span>
          </div>
        </div>
      )}
      
      {isInView && (
        <img
          key={optimizedSrc}
          src={optimizedSrc}
          alt={alt}
          /* ⭐ 'eager' priority images ke liye, 'lazy' baaki ke liye */
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          /* ⭐ Smooth opacity transition (0.4s) ka use ho raha hai. */
          className={`w-full h-full object-cover transition-opacity duration-400 ease-in-out ${
            isLoaded 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-100'
          }`}
          decoding="async" 
        />
      )}
    </div>
  );
};

// React.memo render cycles ko bacha kar performance boost karta hai
export default React.memo(LazyImage);
