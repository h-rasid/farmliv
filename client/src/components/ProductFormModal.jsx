import React, { useState } from 'react';
import { X, Loader2, Upload, AlertCircle, Tag, DollarSign, AlignLeft } from 'lucide-react';
import { mockDB } from '@/lib/mockDatabase';
import { useToast } from '@/components/ui/use-toast';
import { validateProductForm } from '@/utils/formValidation';
import { motion, AnimatePresence } from 'framer-motion';

const ProductFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const categories = mockDB.getProductCategories();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    status: 'active'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'active' : 'inactive') : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const payload = {
        ...formData,
        price: Number(formData.price),
        image: formData.image || 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?auto=format&fit=crop&q=80&w=300'
      };
      mockDB.addProduct(payload);
      toast({ title: "Success", description: "Product added to catalog successfully." });
      if (onSuccess) onSuccess();
      onClose();
      setFormData({ name: '', description: '', price: '', category: '', image: '', status: 'active' });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create product." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Add New Product</h2>
              <p className="text-sm text-gray-500">Expand your catalog inventory</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                placeholder="e.g. Premium Organic Fertilizer"
              />
              {errors.name && <p className="text-red-500 text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" /> Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-xl appearance-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  >
                    <option value="">Select...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.category && <p className="text-red-500 text-xs font-medium">{errors.category}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                   <DollarSign className="w-4 h-4 text-gray-400" /> Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-xs font-medium">{errors.price}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-gray-400" /> Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all resize-none h-28 text-sm ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                placeholder="Detailed product specification..."
              />
              {errors.description && <p className="text-red-500 text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.description}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none"
                  placeholder="https://res.cloudinary.com/dik8mlsie/image/upload/v1771483748/Polyfilm3_w5seiz.webp"
                />
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-gray-500 border border-gray-200">
                  <Upload className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={formData.status === 'active'}
                onChange={handleChange}
                className="w-5 h-5 text-[#2E7D32] border-gray-300 rounded focus:ring-[#2E7D32] cursor-pointer"
              />
              <label htmlFor="status" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Make product active immediately
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] px-6 py-3.5 bg-[#2E7D32] text-white rounded-xl font-semibold hover:bg-[#1B5E20] flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductFormModal;