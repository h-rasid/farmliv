
import React, { useState, Suspense, memo } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, Maximize2 } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';

const ProductGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div 
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group border border-gray-200 shadow-sm cursor-zoom-in card-optimize"
        onClick={() => setIsZoomed(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full framer-motion-optimized"
          >
             <LazyImage
                src={images[selectedImage]}
                alt={`${productName} - Main view`}
                priority={true}
                aspectRatio="1/1"
                sizes="(max-width: 1024px) 100vw, 600px"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 ${
              selectedImage === index 
                ? 'ring-2 ring-[#2E7D32] ring-offset-2 shadow-md' 
                : 'opacity-70 hover:opacity-100 border border-transparent hover:border-gray-300'
            }`}
          >
            <LazyImage
              src={image}
              alt={`${productName} - View ${index + 1}`}
              aspectRatio="1/1"
              sizes="150px"
              className="w-full h-full object-cover"
            />
            {selectedImage === index && (
              <div className="absolute inset-0 bg-[#2E7D32]/10" />
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen Zoom Modal */}
      {/* Conditionally render heavy modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
            style={{ willChange: 'opacity' }}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={images[selectedImage]}
              alt={`${productName} - Zoomed view`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              loading="eager"
            />
            <button 
              className="absolute top-8 right-8 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
            >
              <ZoomIn className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ProductGallery);
