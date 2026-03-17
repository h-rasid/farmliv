import React, { useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from '@/components/ui/LazyImage';

const slides = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1771483790/Shadenet8_tl6o5n.webp',
    title: 'Premium B2B Agricultural Solutions',
    subtitle: 'Trusted by Industry Leaders Worldwide'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1771483749/Polyfilm6_yiinga.webp',
    title: 'Quality Products for Modern Farming',
    subtitle: 'ISO Certified Manufacturing Excellence'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1771484140/weed_mat1_xc5uls.png',
    title: 'Innovative Solutions, Reliable Partnership',
    subtitle: 'Supporting Your Agricultural Success'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSlide]); // Dependency added for cleaner intervals

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  // Swipe sensitivity configuration
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative h-[85vh] sm:h-screen w-full overflow-hidden bg-black contain-layout touch-pan-y pointer-events-auto">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          /* --- Added Drag Logic Start --- */
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              nextSlide();
            } else if (swipe > swipeConfidenceThreshold) {
              prevSlide();
            }
          }}
          /* --- Added Drag Logic End --- */
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30, duration: 0.5 },
            opacity: { duration: 0.3 }
          }}
          className="absolute inset-0 will-change-transform cursor-grab active:cursor-grabbing"
        >
          <div className="relative h-full w-full">
            <LazyImage
              priority={true}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              sizes="(max-width: 768px) 100vw, 1920px"
              className="w-full h-full object-cover pointer-events-none select-none"
            />
            
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent pointer-events-none" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-white px-4 max-w-5xl w-full">
                <div className="overflow-hidden mb-4 sm:mb-6">
                  <motion.h1
                    initial={currentSlide === 0 ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: currentSlide === 0 ? 0 : 0.2, duration: 0.5, ease: "easeOut" }}
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-['Playfair_Display'] leading-tight tracking-tight text-shadow-lg will-change-transform break-words"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                </div>
                
                <div className="overflow-hidden">
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    className="text-base sm:text-xl md:text-2xl lg:text-3xl font-light font-['Poppins'] tracking-wide text-gray-100 will-change-transform px-4"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute inset-x-4 top-1/2 -translate-y-1/2 justify-between z-20 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto p-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 group min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto p-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 group min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Touch Overlay Fix: Modified to support dragging while maintaining click for next slide */}
      <div 
        className="absolute inset-0 z-10 md:hidden pointer-events-none touch-pan-y" 
        onClick={(e) => {
          // If the drag didn't trigger, a simple tap still works
          nextSlide();
        }}
      ></div>

      {/* Indicators */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
            className="group relative py-4 min-h-[44px] min-w-[44px] flex items-center justify-center pointer-events-auto"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-10 sm:w-12 bg-white' : 'w-6 sm:w-8 bg-white/40 group-hover:bg-white/60'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(HeroCarousel);
