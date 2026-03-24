import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import API from '@/utils/axios';

const QuoteModal = ({ isOpen, onClose, productName = '', productId = null }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: productName,
    quantity: '',
    deliveryLocation: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    additionalNotes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // ⭐ SYNC: Database Schema Mapping
      // Hum payload ko vahi keys de rahe hain jo humne backend (index.js) mein fix ki hain
      const payload = {
        customer_name: formData.contactPerson,
        customer_phone: formData.phone,
        product_id: productId, 
        quantity: parseInt(formData.quantity) || 0, // Numeric conversion for DB
        target_date: null, // Modal mein date field nahi hai toh null bhej rahe hain
        requirements: `Company: ${formData.companyName} | Location: ${formData.deliveryLocation} | Notes: ${formData.additionalNotes}`
      };

      // ⭐ CONNECTIVITY: Port 5000 Node Server
      await API.post('/leads', payload);
      
      toast({
        title: "Request Received",
        description: "B2B quote request has been logged successfully.",
        className: "bg-[#2E7D32] text-white border-none shadow-2xl"
      });

      // Reset & Close
      setFormData({
        productName: '', quantity: '', deliveryLocation: '',
        companyName: '', contactPerson: '', email: '',
        phone: '', additionalNotes: ''
      });
      onClose();

    } catch (err) {
      console.error("Submission Error:", err);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Check if your Node.js server (Port 5000) is running.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI styles preserved for Elite Look
  const inputClasses = "w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#2E7D32]/5 focus:border-[#2E7D32] focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium placeholder-gray-400";
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-50">
              <div className="bg-[#1A1A1A] p-10 text-white flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-[2px] w-8 bg-[#2E7D32]"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">B2B Division</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">
                    Bulk <span className="text-[#2E7D32]">Pricing</span>
                  </h2>
                </div>
                <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto bg-white">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Selected Product</label>
                      <input type="text" name="productName" value={productName} readOnly className={`${inputClasses} bg-gray-100 cursor-not-allowed`} />
                    </div>

                    <div>
                      <label className={labelClasses}>Target Quantity</label>
                      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 5000" className={inputClasses} required />
                    </div>

                    <div>
                      <label className={labelClasses}>Full Name</label>
                      <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className={inputClasses} required />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClasses}>Official Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
                    </div>

                    <div>
                      <label className={labelClasses}>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} required />
                    </div>

                    <div>
                      <label className={labelClasses}>Company Name</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClasses} />
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-[#1A1A1A] text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest hover:bg-[#2E7D32] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                    {isSubmitting ? (
                      <> <Loader2 className="w-5 h-5 animate-spin" /> DISPATCHING... </>
                    ) : (
                      <> DISPATCH REQUEST <Send className="w-4 h-4" /> </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
