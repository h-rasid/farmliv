import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Phone, Mail, Building2, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import API from '@/utils/axios';
import { isValidPhone } from '@/utils/formValidation';

const QuickEnquiryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    companyName: '',
    location: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const numericValue = value.replace(/[^0-9]/g, '');
      // ⭐ Strict: If not empty, first digit must be 6-9 for Indian mobile numbers
      if (numericValue.length > 0 && !/[6-9]/.test(numericValue[0])) return;
      
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⭐ Validate Mobile Number
    if (!isValidPhone(formData.mobile)) {
      setStatus({ loading: false, success: false, error: "Please enter a valid 10-digit mobile number." });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      // ⭐ UPDATED: Dedicated endpoint for Quick Enquiry
      const response = await API.post('/quick-enquiries', {
        representative_identity: formData.fullName,
        primary_contact_hub: formData.mobile,
        email_node: formData.email,
        farmliv_entity: formData.companyName,
        deployment_location: formData.location,
        additional_protocols: formData.message
      });

      if (response.status === 201 || response.status === 200) {
        setStatus({ loading: false, success: true, error: null });
        setTimeout(() => {
          onClose();
          navigate('/thank-you');
        }, 1500);
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: "Submission failed. Please try again." });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        {/* Dark Background Overlay */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors z-20">
            <X size={24} />
          </button>

          <div className="p-8 lg:p-10 text-center">
            <h2 className="text-2xl font-black text-[#2E7D32] uppercase tracking-tighter mb-1 italic">Quick Enquiry</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8">Direct Industrial Support Node</p>

            <AnimatePresence mode="wait">
              {status.success ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-[#2E7D32]" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Enquiry Sent!</h3>
                  <p className="text-gray-500 text-sm mt-2">We will contact you shortly.</p>
                </motion.div>
              ) : (
                <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Full Name *" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 font-semibold" />
                  </div>

                  {/* Mobile - Alag line mein */}
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input required name="mobile" value={formData.mobile} onChange={handleChange} type="tel" placeholder="Mobile Number *" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 font-semibold" />
                  </div>

                  {/* Email - Alag line mein */}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email ID *" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 font-semibold" />
                  </div>

                  {/* Company Name */}
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="Company Name" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 font-semibold" />
                  </div>

                  {/* Location */}
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="Location (City, State)" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 font-semibold" />
                  </div>

                  {/* Message */}
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Share details of your requirement..." rows="3" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 font-semibold resize-none"></textarea>

                  {status.error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{status.error}</p>}

                  <button 
                    disabled={status.loading}
                    className="w-full bg-[#2E7D32] text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-lg active:scale-95 mt-4 disabled:opacity-50"
                  >
                    {status.loading ? <Loader2 className="animate-spin" size={16} /> : <>Submit Inquiry <Send size={14} /></>}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickEnquiryModal;

