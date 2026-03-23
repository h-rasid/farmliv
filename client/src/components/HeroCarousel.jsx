import React, { useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import LazyImage from '@/components/ui/LazyImage';

const slides = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Shadenet_ew7jv2.webp',
    title: 'Premium B2B Agricultural Solutions',
    subtitle: 'Trusted by Industry Leaders Worldwide'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Polyfilm_an9qiy.webp',
    title: 'Quality Products for Modern Farming',
    subtitle: 'ISO Certified Manufacturing Excellence'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/weedmat_sfqcil.jpg',
    title: 'Innovative Solutions, Reliable Partnership',
    subtitle: 'Supporting Your Agricultural Success'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  // ⭐ Aggressive Preloading of All Slides
  useEffect(() => {
    slides.forEach((slide) => {
      // Preload next-gen quality (eco) at 1080w to match LazyImage priority logic
      const preloadUrl = slide.image.replace('/upload/', '/upload/f_auto,q_auto:eco,w_1080/');
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = preloadUrl;
      document.head.appendChild(link);
    });
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, zIndex: 1 },
    exit: { opacity: 0, zIndex: 0 }
  };

  const SWIPE_THRESHOLD = 50;

  return (
    <div className="relative h-[85vh] sm:h-screen w-full overflow-hidden touch-pan-y pointer-events-auto">
      {/* Dynamic Background Layer — fully covers the whole area, no black gaps */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: `url(${slides[currentSlide].image.replace('/upload/', '/upload/e_blur:800,f_auto,q_auto:low,w_200/')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(25px) brightness(0.85)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.8, ease: "easeInOut" }
          }}
          className="absolute inset-0 will-change-transform z-10"
        >
          {/* Invisible drag layer - captures swipe without moving the image or blocking button clicks */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -SWIPE_THRESHOLD) nextSlide();
              else if (offset.x > SWIPE_THRESHOLD) prevSlide();
            }}
            className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing pointer-events-auto"
            style={{ touchAction: 'pan-y' }}
          />
          {/* Ken Burns effect wrapper for the structural image */}
          <motion.div 
            className="relative h-full w-full bg-transparent overflow-hidden"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          >
            <LazyImage
              priority={true}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              aspectRatio={null}
              width="1600"
              height="1080"
              objectFit="cover"
              sizes="100vw"
              className="w-full h-full object-cover pointer-events-none select-none opacity-70"
            />
            
            {/* Minimal overlay just to ensure text is readable, no solid gradients */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            
            <div className="absolute inset-0 flex flex-col justify-center pointer-events-none px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40">
              <div className="max-w-4xl pt-20">
                <div className="overflow-hidden mb-6 sm:mb-8">
                  <motion.h1
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold font-['Playfair_Display'] leading-[1.1] tracking-tight text-white drop-shadow-xl"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                </div>
                
                <div className="overflow-hidden mb-8 sm:mb-12">
                  <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg sm:text-xl md:text-2xl font-light font-['Poppins'] tracking-wide text-gray-200 drop-shadow-md max-w-2xl"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                </div>

                {/* Professional Call To Action Button */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-auto relative z-30"
                >
                  <Link 
                    to="/products"
                    className="inline-flex items-center gap-3 bg-white hover:bg-green-50 text-green-900 px-8 py-4 sm:px-10 sm:py-5 rounded-sm font-semibold text-sm md:text-base tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 group"
                  >
                    Explore Products
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Navigation Arrows (Sleeker, minimalist styling) */}
      <div className="hidden md:flex absolute inset-x-8 top-1/2 -translate-y-1/2 justify-between z-20 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto p-3 rounded-full border border-white/10 bg-black/20 hover:bg-white/10 hover:border-white/30 backdrop-blur-md text-white/80 hover:text-white transition-all duration-500 hover:scale-110 group min-w-[50px] min-h-[50px] flex items-center justify-center shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto p-3 rounded-full border border-white/10 bg-black/20 hover:bg-white/10 hover:border-white/30 backdrop-blur-md text-white/80 hover:text-white transition-all duration-500 hover:scale-110 group min-w-[50px] min-h-[50px] flex items-center justify-center shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* Refined Progress Indicators */}
      <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 md:left-20 lg:left-32 xl:left-40 flex gap-3 sm:gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
            className="group relative py-4 min-w-[32px] flex items-center justify-center pointer-events-auto"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`h-[3px] rounded-full transition-all duration-500 ${
              index === currentSlide ? 'w-12 sm:w-16 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-8 sm:w-10 bg-white/30 group-hover:bg-white/60'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(HeroCarousel);
