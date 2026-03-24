import React from 'react';
import { m as motion } from 'framer-motion';

// ⭐ Link ko hata kar 'openModal' prop ka istemal kiya gaya hai
const QuickEnquiryTab = ({ openModal }) => {
  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      /* Edge se gap aur positioning barkarar hai */
      className="fixed right-2 lg:right-4 top-[28%] lg:top-[40%] -translate-y-1/2 z-[998]"
    >
      {/* ⭐ CHANGED: Link tag ko 'button' se badal diya hai taaki popup trigger ho sake */}
      <button 
        onClick={openModal} 
        /* Added backdrop-blur and semi-transparent bg for premium look */
        className="bg-[#2E7D32]/90 backdrop-blur-md text-white py-4 lg:py-6 px-2.5 lg:px-4 rounded-xl lg:rounded-2xl shadow-[0_20px_50px_rgba(46,125,50,0.3)] flex flex-col items-center hover:bg-gray-900 transition-all duration-300 border border-white/30 group relative overflow-hidden outline-none"
      >
        {/* Subtle glossy light effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>

        {/* Hover transition layer */}
        <div className="absolute inset-0 bg-[#1A1A1A] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>

        {/* Text content with relative z-index for visibility */}
        <span className="[writing-mode:vertical-lr] rotate-180 font-bold lg:font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[8px] sm:text-[9px] lg:text-[11px] relative z-10 transition-colors">
          Quick Enquiry
        </span>

        {/* Indicator Dot with pulse animation */}
        <div className="mt-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)] relative z-10"></div>
      </button>
    </motion.div>
  );
};

export default QuickEnquiryTab;
