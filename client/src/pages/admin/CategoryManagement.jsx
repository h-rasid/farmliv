import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Plus, Edit3, Trash2, X, Upload, 
  ChevronRight, FolderTree, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { API_BASE } from '@/utils/config';

const CategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ⭐ 3️⃣ CATEGORY & SUB-CATEGORY STATE
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    image: null, 
    parent_id: null // Used for Sub-Category creation
  });


  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" });
    } finally { setLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);
    if (formData.parent_id) data.append('parent_id', formData.parent_id);

    try {
      if (editingCat) {
        await axios.put(`${API_BASE}/api/categories/${editingCat.id}`, data);
        toast({ title: "Category Updated" });
      } else {
        await axios.post(`${API_BASE}/api/categories`, data);
        toast({ title: "New Category Deployed" });
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast({ variant: "destructive", title: "Action Failed" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge category and its sub-categories?")) return;
    try {
      await axios.delete(`${API_BASE}/api/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast({ title: "Category Purged" });
    } catch (err) { toast({ variant: "destructive", title: "Delete Error" }); }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
    setPreviewUrl(null);
    setFormData({ name: '', description: '', image: null, parent_id: null });
  };

  return (
    <PortalLayout role="admin">
      <div className="max-w-[1400px] mx-auto p-10 space-y-12 font-sans text-slate-900">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Category Intelligence</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">B2B Product Tree Management</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-xs font-semibold hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
            <Plus size={18} /> Add Main Category
          </button>
        </div>

        {/* Category Tree Display */}
        {loading ? (
          <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(c => !c.parent_id).map(cat => (
              <div key={cat.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:border-emerald-100 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-50">
                    <img src={cat.image ? `${API_BASE}${cat.image}` : '/cat-placeholder.jpg'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingCat(cat); setFormData({...cat, image: null}); setIsModalOpen(true); }} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600"><Edit3 size={14}/></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 bg-slate-50 rounded-lg text-rose-400 hover:bg-rose-50"><Trash2 size={14}/></button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold uppercase tracking-tight mb-2">{cat.name}</h3>
                <p className="text-xs text-slate-400 mb-6 line-clamp-2">{cat.description || 'No description provided.'}</p>
                
                {/* ⭐ Sub-Category Node Creator */}
                <div className="space-y-3 pt-4 border-t border-slate-50">
                   <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>Linked Sub-Categories</span>
                     <button onClick={() => { setFormData({...formData, parent_id: cat.id}); setIsModalOpen(true); }} className="text-emerald-600 hover:underline">+ Add Sub</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {categories.filter(sub => sub.parent_id === cat.id).map(sub => (
                       <span key={sub.id} className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-medium text-slate-600 flex items-center gap-1">
                         <ChevronRight size={10} /> {sub.name}
                       </span>
                     ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ⭐ CATEGORY MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={closeModal}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8 pb-4 border-b">
                  <h2 className="text-xl font-semibold">{formData.parent_id ? 'Add Sub-Category' : 'Main Category'}</h2>
                  <button onClick={closeModal}><X size={24}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Label Name</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Visual Identity</label>
                    <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 text-center relative hover:border-emerald-200 transition-all cursor-pointer">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                      {previewUrl ? <img src={previewUrl} className="h-16 mx-auto rounded-lg mb-2" /> : <Upload className="mx-auto mb-2 text-slate-200" size={32} />}
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Upload Icon/Image</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Category Description</label>
                    <textarea rows="3" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-semibold uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all">
                      {editingCat ? 'Update Category' : 'Finalize Category'}
                    </button>
                    <button type="button" onClick={closeModal} className="px-6 bg-slate-100 text-slate-600 py-4 rounded-2xl font-semibold uppercase tracking-widest text-[10px]">Cancel</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PortalLayout>
  );
};

export default CategoryManagement;