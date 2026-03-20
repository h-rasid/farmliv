
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { productCategories } from '@/data/products';
import LazyImage from '@/components/ui/LazyImage';

const FeaturedCategories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 contain-content">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm">Our Product Category</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6 font-['Playfair_Display']">
            Specialized Agricultural Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Explore our comprehensive range of premium grade materials designed for professional farming excellence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {productCategories.map((category) => (
            <motion.div key={category.id} variants={cardVariants} className="will-change-transform">
              <Link to={`/products/${category.id}`} className="group block relative h-[400px] w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 card-optimize">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                     <LazyImage
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                  </div>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3 font-['Playfair_Display'] group-hover:text-[#D4AF37] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-semibold text-sm tracking-wide">
                    <span className="border-b border-[#D4AF37] pb-0.5">Explore Category</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(FeaturedCategories);