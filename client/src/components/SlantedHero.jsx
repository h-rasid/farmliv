import React from 'react';
import { motion } from 'framer-motion';
import LazyImage from '@/components/ui/LazyImage';

const slides = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Shadenet_ew7jv2.webp',
    title: 'Precision Shading',
    description: 'B2B Shade Net Solutions'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Polyfilm_an9qiy.webp',
    title: 'Advanced Polyfilm',
    description: 'Elite Greenhouse Coverage'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/weedmat_sfqcil.jpg',
    title: 'Weed Control',
    description: 'Superior Mat Technology'
  }
];

const SlantedHero = () => {
  return (
    <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden bg-black flex flex-col md:flex-row">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          className="relative group flex-1 h-1/3 md:h-full overflow-hidden cursor-pointer"
          style={{
            clipPath: index === 0 
              ? 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' 
              : index === 1 
                ? 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)' 
                : 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
            marginLeft: index === 0 ? '0' : '-5%',
            zIndex: 10 - index
          }}
        >
          {/* Mobile Clip Path override - just simple rectangles */}
          <div className="md:hidden absolute inset-0 bg-black" style={{ clipPath: 'none' }} />
          
          <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110 ease-out">
            <LazyImage
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              priority={index === 0}
            />
          </div>
          
          {/* Enhanced Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-20 p-6 text-white text-center z-20">
            <motion.div
              initial={false}
              className="flex flex-col items-center"
            >
              <h3 
                className="text-2xl md:text-5xl font-black font-['Playfair_Display'] mb-3 drop-shadow-2xl transition-all duration-500 group-hover:scale-105"
              >
                {slide.title}
              </h3>
              <p 
                className="text-[10px] md:text-sm font-light tracking-[0.3em] uppercase mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out"
              >
                {slide.description}
              </p>
              
              <div className="h-[2px] w-0 group-hover:w-32 bg-white/80 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </motion.div>
          </div>

          {/* Slanted Border/Divider effect - White Line like the screenshot */}
          {index < 2 && (
            <div 
              className="absolute top-0 right-0 h-full w-[2px] bg-white hidden md:block z-30 opacity-70"
              style={{
                transform: 'skewX(-15deg) translateX(4px)',
                boxShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}
            />
          )}
        </motion.div>
      ))}
    </section>
  );
};

export default SlantedHero;
