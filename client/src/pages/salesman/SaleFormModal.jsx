import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, Receipt, CreditCard, 
  Truck, User, Smartphone, IndianRupee 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { API_BASE } from '@/utils/config';

const SaleFormModal = ({ isOpen, onClose, leadData, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    final_price: leadData?.price || '',
    payment_method: 'cash',
    delivery_notes: '',
    transaction_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const cleanUserId = JSON.parse(localStorage.getItem('farmliv_user')).id.toString().split(':')[0];
      
      // 1. Record the Sale
      await axios.post(`${API_BASE}/api/sales`, {
        lead_id: leadData.id,
        salesman_id: cleanUserId,
        final_price: formData.final_price,
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id
      });

      // 2. Update Lead Status to 'converted'
      await axios.put(`${API_BASE}/api/leads/${leadData.id}/status`, {
        status: 'converted',
        changed_by: cleanUserId
      });

      toast({ title: "Sale Synchronized", description: "Inquiry converted to successful transaction." });
      onSuccess();
      onClose();
    } catch (err) {
      toast({ variant: "destructive", title: "Transaction Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ scale: 0.9, y: 30, opacity: 0 }} 
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-portal-card overflow-hidden shadow-2xl border border-gray-100"
      >
        {/* --- Elite Header --- */}
        <div className="bg-gray-900 p-12 text-white relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={28} />
          </button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-farmliv-green rounded-3xl flex items-center justify-center shadow-lg">
              <Receipt size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Final <span className="text-farmliv-green">Checkout</span></h2>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Transaction Record #{leadData?.id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10 bg-[#FAFAFA]">
          
          {/* Customer Intelligence Node */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                  <User size={14} className="text-farmliv-green" />
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Client</p>
               </div>
               <p className="font-black text-gray-900 uppercase italic">{leadData?.customer_name}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                  <Smartphone size={14} className="text-farmliv-green" />
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Product Node</p>
               </div>
               <p className="font-black text-gray-900 uppercase italic">{leadData?.product_name}</p>
            </div>
          </div>

          {/* Pricing Engine */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Agreed Transaction Value</label>
             <div className="relative">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-farmliv-green">
                   <IndianRupee size={24} strokeWidth={3} />
                </div>
                <input 
                  type="number" 
                  value={formData.final_price}
                  onChange={(e) => setFormData({...formData, final_price: e.target.value})}
                  className="w-full bg-white border-2 border-gray-50 p-8 pl-16 rounded-[2.5rem] text-4xl font-black italic text-gray-900 focus:border-farmliv-green/20 outline-none transition-all shadow-inner" 
                  placeholder="0.00"
                  required
                />
             </div>
          </div>

          {/* Payment Architecture */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Payment Protocol</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, payment_method: 'cash'})}
                className={`p-6 rounded-[2rem] flex items-center justify-center gap-4 border-2 transition-all font-black uppercase text-[10px] tracking-widest ${
                  formData.payment_method === 'cash' 
                    ? 'border-farmliv-green bg-farmliv-light text-farmliv-green shadow-lg scale-105' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                }`}
              >
                <IndianRupee size={18} /> Physical Cash
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, payment_method: 'online'})}
                className={`p-6 rounded-[2rem] flex items-center justify-center gap-4 border-2 transition-all font-black uppercase text-[10px] tracking-widest ${
                  formData.payment_method === 'online' 
                    ? 'border-farmliv-green bg-farmliv-light text-farmliv-green shadow-lg scale-105' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                }`}
              >
                <CreditCard size={18} /> Digital Pay
              </button>
            </div>
          </div>

          {formData.payment_method === 'online' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Transaction Hash / ID</label>
              <input 
                type="text" 
                className="w-full p-6 bg-white border-2 border-gray-50 rounded-[2rem] font-bold text-sm outline-none focus:border-farmliv-green/20"
                value={formData.transaction_id}
                onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                placeholder="Enter UPI/Bank Reference"
                required
              />
            </motion.div>
          )}

          {/* Submit Trigger */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-farmliv-green text-white py-10 rounded-portal-btn font-black uppercase text-sm tracking-[0.6em] shadow-farmliv-shadow hover:-translate-y-2 transition-all duration-500 disabled:bg-gray-200 flex items-center justify-center gap-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
            {isSubmitting ? 'Synchronizing...' : 'Authorize Transaction'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SaleFormModal;