import React, { useState, useEffect, useRef, useCallback } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  imgClassName = '', 
  priority = false, 
  aspectRatio = '16/9', 
  objectFit = null, 
  fullHeight = true,
  maxWidth = null, 
  sizes = "100vw",
  width = "1920",  // ⭐ Default aspect ratio hint
  height = "1080"
}) => {
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

  const getOptimizedUrl = (url, width) => {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      // Avoid double injection
      // ⭐ Use c_fill for cover images to handle aspect ratio on server
      // Aggressive optimization for priority images (LCP)
      const quality = priority ? 'q_auto:eco' : 'q_auto:low';
      let params = objectFit === 'cover' ? `f_auto,${quality},c_fill,g_auto` : `f_auto,${quality},c_limit`;
      
      if (width) {
        params += `,w_${width}`;
      } else if (maxWidth) {
        params += `,w_${maxWidth}`;
      } else if (priority) {
        params += ',w_1080'; 
      } else {
        params += ',w_800'; 
      }
      
      return url.replace('/upload/', `/upload/${params}/`);
    }
    return url;
  };

  // ⭐ Generate srcSet for responsive images
  const generateSrcSet = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    const widths = [320, 640, 828, 1080, 1280, 1920];
    return widths
      .map(w => `${getOptimizedUrl(url, w)} ${w}w`)
      .join(', ');
  };

  const optimizedSrc = getOptimizedUrl(src);
  const srcSet = generateSrcSet(src);

  return (
    <div 
      ref={imgRef} 
      /* ⭐ 'will-change-transform' Hardware Acceleration provide karta hai */
      className={`relative overflow-hidden ${priority ? 'bg-transparent' : 'bg-slate-50'} will-change-transform ${className}`}
      style={aspectRatio && aspectRatio !== 'none' ? { aspectRatio } : {}} 
    >
      {/* Placeholder Loading Spinner - ONLY for non-priority images to avoid LCP jitter */}
      {!isLoaded && !error && !priority && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 animate-pulse z-10 backdrop-blur-[2px]">
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
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          /* ⭐ 'eager' priority images ke liye, 'lazy' baaki ke liye */
          loading={priority ? 'eager' : 'lazy'}
          /* ⭐ 'high' priority images ke liye (LCP optimization) */
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          /* ⭐ Smooth opacity transition (0.4s) but bypass for priority images to maximize LCP/SpeedIndex scores. */
          className={`w-full ${fullHeight ? 'h-full' : 'h-auto'} ${
            !priority ? 'transition-opacity duration-400 ease-in-out' : ''
          } ${
            (isLoaded || priority)
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-100'
          } ${imgClassName}`}
          style={objectFit ? { objectFit, maxHeight: '100%' } : { maxHeight: '100%' }}
          decoding="async" 
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

// React.memo render cycles ko bacha kar performance boost karta hai
export default React.memo(LazyImage);
