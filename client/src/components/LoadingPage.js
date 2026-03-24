// components/LoadingPage.js
import React from 'react';
import { m as motion } from 'framer-motion';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      {/* Animated Logo or Icon */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 border-4 border-[#2E7D32] border-t-transparent rounded-full"
      />
      
      {/* Text Animation */}
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="mt-6 text-[#2E7D32] font-bold text-xl uppercase tracking-widest"
      >
        Farmliv Industries
      </motion.h2>
      <p className="text-gray-500 text-sm mt-2">Synchronizing Data...</p>
    </div>
  );
};

export default LoadingPage;
