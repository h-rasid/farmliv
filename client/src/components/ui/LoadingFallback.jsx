import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; // Added for smoother branding

const LoadingFallback = () => (
  /* Matching index.html style for seamless visual transitions */
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
    <div className="relative w-12 h-12 flex items-center justify-center mb-4">
      <div className="w-full h-full border-3 border-[#f3f3f3] border-t-3 border-[#2E7D32] rounded-full animate-spin"></div>
      <div className="absolute w-2 h-2 bg-[#2E7D32] rounded-full"></div>
    </div>
    <h2 className="text-[#2E7D32] font-extrabold text-xl uppercase tracking-[0.3em] mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      Farmliv
    </h2>
    <p className="text-gray-400 text-[11px] font-medium animate-pulse">
      Loading page
    </p>
  </div>
);

export default LoadingFallback;