import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; // Added for smoother branding

const LoadingFallback = () => (
  /* - min-h-[50vh] ko h-screen se replace kiya taaki poori screen cover ho.
     - bg-white use kiya taaki flicker na dikhe.
  */
  <div className="h-screen w-full flex items-center justify-center bg-white fixed inset-0 z-[1000]">
    <div className="text-center">
      {/* Central Spinner */}
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2E7D32] animate-spin mx-auto mb-4" />
        {/* Optional: Chota logo dot beech mein */}
        <div className="absolute w-2 h-2 bg-[#2E7D32] rounded-full"></div>
      </div>

      {/* Brand Name Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-[#2E7D32] font-bold text-xl uppercase tracking-[0.3em] mb-2">
          Farmliv
        </h2>
        <p className="text-gray-400 text-xs font-medium animate-pulse">
          Loading page
        </p>
      </motion.div>

      {/* Progress Bar (Optional Visual) */}
      <div className="mt-8 w-48 h-1 bg-gray-100 rounded-full overflow-hidden mx-auto">
        <motion.div 
          className="h-full bg-[#2E7D32]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  </div>
);

export default LoadingFallback;