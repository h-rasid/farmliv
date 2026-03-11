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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-[10px] lg:text-xs text-center p-2 font-medium">
          <div className="flex flex-col items-center">
            <span>⚠️ Image Unavailable</span>
          </div>
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
          className={`w-full h-full object-cover transition-opacity duration-400 ease-in-out ${
            isLoaded 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-100'
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
