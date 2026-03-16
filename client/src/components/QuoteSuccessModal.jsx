import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FileText, LayoutDashboard, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuoteSuccessModal = ({ isOpen, onClose, quoteData }) => {
  
  // ⭐ Auto-trigger print or download message when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Modal Ready: PDF has been initiated via QuoteForm logic.");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {/* Header Status */}
          <div className="bg-green-50/50 py-10 flex flex-col items-center border-b border-green-100">
            <CheckCircle2 className="w-16 h-16 text-[#2E7D32] mb-4" />
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none italic">
              Request <span className="text-[#2E7D32]">Dispatched</span>
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
              Reference: {quoteData?.referenceNumber || 'FLV-SYNC-PENDING'}
            </p>
          </div>

          {/* Details Section */}
          <div className="p-10 space-y-6 bg-white">
            <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</span>
                <span className="text-xs font-black text-gray-900 uppercase">{quoteData?.productName || 'Agricultural Product'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Volume</span>
                <span className="text-xs font-black text-gray-900">{quoteData?.quantity || '0'} Units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submission Date</span>
                <span className="text-xs font-black text-gray-900">{new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </div>

            {/* Action Interface */}
            <div className="space-y-3">
              <div className="text-center mb-4">
                <p className="text-[11px] font-bold text-green-600 animate-pulse">
                  ✅ PDF Quote has been generated and saved to your device.
                </p>
              </div>

              <button 
                onClick={() => window.print()} 
                className="w-full bg-[#1A1A1A] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2E7D32] transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <FileText size={16} /> Re-Download Official Quote
              </button>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link 
                  to="/products"
                  className="bg-white border border-gray-100 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <Search size={14} /> Catalog
                </Link>
                <Link 
                  to="/"
                  className="bg-white border border-gray-100 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <LayoutDashboard size={14} /> Home
                </Link>
              </div>
            </div>
          </div>

          {/* Close Handle */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuoteSuccessModal;