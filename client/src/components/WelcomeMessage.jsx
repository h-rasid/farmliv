import React from 'react';
import { m as motion } from 'framer-motion';
import { Sparkles } from 'lucide-react'; // Elite touch ke liye icon

const WelcomeMessage = () => {
  return (
    <div className="space-y-2 py-4">
      {/* Brand Indicator */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center gap-2"
      >
        <span className="h-[1px] w-8 bg-[#2E7D32]"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
          Farmliv Intelligence
        </span>
      </motion.div>

      {/* Main Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        className="flex items-start gap-3"
      >
        <div className="mt-1">
          <Sparkles size={16} className="text-[#2E7D32]" />
        </div>
        <p className="text-sm font-bold text-white leading-relaxed max-w-md tracking-tight">
          Welcome to the <span className="text-[#2E7D32]">Command Center</span>. 
          Describe the feature or product you wish to generate, and I'll handle the rest.
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomeMessage;

