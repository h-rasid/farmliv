import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import { X, Loader2, Calendar, DollarSign, Package, User, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { m as motion, AnimatePresence } from 'framer-motion';

const SalesRecordModal = ({ isOpen, onClose, onSuccess, recordToEdit = null }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // Database products

  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
    sale_date: new Date().toISOString().split('T')[0],
    customer_name: '',
    amount: '',
    notes: ''
  });

  // --- 1. Fetch Real Products from Database ---
  useEffect(() => {
    if (isOpen) {
      const fetchCatalog = async () => {
        try {
          const res = await API.get('/products');
          setProducts(res.data);
        } catch (err) {
          console.error("Catalog Sync Error", err);
        }
      };
      fetchCatalog();
    }
  }, [isOpen]);

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        ...recordToEdit,
        sale_date: recordToEdit.sale_date.split('T')[0],
      });
    } else {
      setFormData({
        product_id: '',
        quantity: 1,
        sale_date: new Date().toISOString().split('T')[0],
        customer_name: '',
        amount: '',
        notes: ''
      });
    }
  }, [recordToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        sales_person_id: user.id, // Auth context se salesperson tracking
      };

      // --- 2. Real API Calls (Replacing mockDB) ---
      if (recordToEdit) {
        await API.put(`/sales/${recordToEdit.id}`, payload);
        toast({ title: 'Success', description: 'Transaction record updated.' });
      } else {
        await API.post('/sales', payload);
        toast({ title: 'Success', description: 'New sale committed to database.' });
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Transmission Error', description: 'Server offline or database error.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-gray-100"
        >
          {/* Elite Header */}
          <div className="px-10 py-8 bg-[#1A1A1A] text-white flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-[2px] w-8 bg-[#2E7D32]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Sales Ledger</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                {recordToEdit ? 'Edit' : 'Record'} <span className="text-[#2E7D32]">Sale</span>
              </h2>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-white overflow-y-auto max-h-[70vh]">
            {/* Product Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Package size={14} className="text-[#2E7D32]" /> Select Product
              </label>
              <select
                required
                className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#2E7D32]/5 appearance-none"
                value={formData.product_id}
                onChange={(e) => setFormData({...formData, product_id: e.target.value})}
              >
                <option value="">Choose from catalog...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Volume</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#2E7D32]/5"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Total Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#2E7D32]/5"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                  />
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E7D32]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <User size={14} className="text-[#2E7D32]" /> Customer Entity
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#2E7D32]/5"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  placeholder="Client Name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Calendar size={14} className="text-[#2E7D32]" /> Ledger Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#2E7D32]/5"
                  value={formData.sale_date}
                  onChange={(e) => setFormData({...formData, sale_date: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <FileText size={14} className="text-[#2E7D32]" /> Transaction Notes
              </label>
              <textarea
                className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#2E7D32]/5 h-24 resize-none"
                placeholder="Specific order details or terms..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-5 border border-gray-100 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-[#1A1A1A] text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-[#2E7D32] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (recordToEdit ? 'Commit Changes' : 'Finalize Sale')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SalesRecordModal;

