import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { API_BASE } from '@/utils/config';
import API from '@/utils/axios';
import LazyImage from '@/components/ui/LazyImage';

const FALLBACK_CATEGORIES = [
  { id: 'f1', name: 'Weed Control', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/weedmat1_rln1ds.jpg', description: 'High quality weed mats for effective suppression.' },
  { id: 'f2', name: 'Mulch & Films', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Polyfilm_an9qiy.webp', description: 'Agricultural films for moisture retention.' },
  { id: 'f3', name: 'Greenhouse Materials', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Shadenet_ew7jv2.webp', description: 'Poly films and covers for greenhouses.' },
  { id: 'f4', name: 'Water Management', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/pondliner_vscz7q.jpg', description: 'Pond liners and waterproofing solutions.' }
];

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("🔍 Fetching Categories for Home...");
        const res = await API.get('/categories');
        const mainCats = res.data.filter(c => !c.parent_id);
        
        if (mainCats.length > 0) {
          setCategories(mainCats);
        } else {
          console.warn("⚠️ No main categories from API, using fallback.");
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        console.error("❌ Failed to fetch featured categories, using fallback.");
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 1 }, // Changed from 0 to 1 for resilience
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 1, y: 0 }, // Changed from opacity: 0 and y: 20
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
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-visible section-isolate" id="categories">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="will-change-transform">
              <Link to={`/products/${category.name.toLowerCase().replace(/ /g, '-')}`} className="group block relative h-[400px] w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 card-optimize">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                     <LazyImage
                        src={category.image ? (category.image.startsWith('http') ? category.image : `${API_BASE}${category.image}`) : '/cat-placeholder.jpg'}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        aspectRatio="3/4"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      />
                  </div>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-3 font-['Playfair_Display'] group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 italic">
                    {category.description || 'Premium agricultural solution engineered by Farmliv Industries.'}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-semibold text-sm tracking-wide">
                    <span className="border-b border-[#D4AF37] pb-0.5">Explore Category</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default memo(FeaturedCategories);

