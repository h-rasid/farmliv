import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { ArrowRight, Package, Tag } from 'lucide-react';
import LazyImage from './ui/LazyImage'; 
import { API_BASE } from '@/utils/config';

const ProductCard = ({ product }) => {

  // ⭐ Dynamic Price Handling: Database se retail_price ya bulk_price fetch karna
  const formattedPrice = product?.retail_price 
    ? `₹${product.retail_price}` 
    : product?.bulk_price 
      ? `₹${product.bulk_price}` 
      : 'Price on Request';

  const displayCategory = product?.category 
    ? product.category.replace('-', ' ') 
    : 'General';

  // ⭐ FIXED: Images array se pehli photo nikalne ka logic
  const getImageUrl = () => {
    // Check karein ki 'images' array hai aur usme data hai
    const hasImages = product?.images && Array.isArray(product.images) && product.images.length > 0;
    
    if (!hasImages) return '/placeholder.jpg';

    // Array ki pehli image [0] select karein
    const firstImage = product.images[0];
    
    // Agar path already full URL hai toh wahi dikhao, nahi toh BASE_URL add karo
    return firstImage.startsWith('http') 
      ? firstImage 
      : `${API_BASE}${firstImage}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 h-full"
    >
      <Link 
        to={String(product?.id) === '2' ? '/heavy-duty-weed-control-mat-manufacturer' : `/product/${product?.id}`} 
        className="block h-full flex flex-col"
      >
        {/* IMAGE SECTION */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-in-out">
            <LazyImage
              src={getImageUrl()} 
              alt={product?.name || 'Product Image'}
              className="w-full h-full object-cover"
              aspectRatio="16/9"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* CATEGORY BADGE */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#2E7D32] text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest">
              {displayCategory}
            </span>
          </div>
        </div>
        
        {/* CONTENT SECTION */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans group-hover:text-[#2E7D32] transition-colors line-clamp-1">
            {product?.name || 'Farmliv Product'}
          </h3>
          
          <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
            {product?.description || 'Premium agricultural solution provided by Farmliv.'}
          </p>
          
          <div className="space-y-4 mt-auto">
            {product?.gsm && (
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#2E7D32] bg-green-50/50 p-3 rounded-xl border border-green-100">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {product.gsm} GSM
                </div>
              </div>
            )}

            {/* PRICE & ACTION */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Starting From</span>
                <span className="text-[#2E7D32] font-black text-lg tracking-tight">{formattedPrice}</span>
              </div>
              
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-900 group-hover:text-[#2E7D32] transition-colors bg-gray-100 group-hover:bg-[#2E7D32]/10 px-3 py-2 rounded-lg">
                View Details
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default memo(ProductCard);

