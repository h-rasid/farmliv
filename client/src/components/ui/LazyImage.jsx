import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getOptimizedCloudinaryUrl as getOptimizedUrl } from '@/utils/imageUtils';

const LazyImage = ({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false); 
  const imgRef = useRef(null);

  // Optimized URLs for better performance
  const optimizedSrc = useMemo(() => getOptimizedUrl(src), [src]);
  
  const optimizedSrcSet = useMemo(() => {
    if (!src || !src.includes('cloudinary.com')) return undefined;
    
    return [
      `${getOptimizedUrl(src, 400)} 400w`,
      `${getOptimizedUrl(src, 800)} 800w`,
      `${getOptimizedUrl(src, 1200)} 1200w`,
      `${getOptimizedUrl(src, 1600)} 1600w`
    ].join(', ');
  }, [src]);

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
        rootMargin: '200px', 
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden bg-slate-50 will-change-transform ${className}`}
      style={{ aspectRatio: '16/9' }} 
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse z-10">
          <div className="w-8 h-8 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 select-none">
          <div className="mb-2 opacity-50">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase">Image Currently Unavailable</span>
        </div>
      )}
      
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          crossOrigin="anonymous"
          className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
            isLoaded 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-110 blur-sm'
          }`}
          srcSet={optimizedSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          decoding="async"
        />
      )}
    </div>
  );
};

export default React.memo(LazyImage);
