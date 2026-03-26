import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, X, Video, 
  Image as ImageIcon, Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { API_BASE } from '@/utils/config';

const ProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showQuickAddSub, setShowQuickAddSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');

  const [formData, setFormData] = useState({ 
    name: '', description: '', category: [], subCategory: '', 
    moq: '', gsm: '', durability: '', hsn: '',
    status: 'Active', images: [], video: null 
  });

  useEffect(() => { 
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" });
    } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const handleQuickAddSub = async () => {
    if (!newSubName || formData.category.length === 0) return;
    // Use first selected category as parent for simplicity in quick add
    const parentCatName = formData.category[0];
    const parentCat = categories.find(c => c.name === parentCatName);
    if (!parentCat) return;

    try {
      const res = await API.post('/categories', { 
        name: newSubName, 
        parent_id: parentCat.id,
        description: `Sub-category of ${parentCat.name}`
      });
      toast({ title: "Sub-Category Created" });
      await fetchCategories();
      setFormData({ ...formData, subCategory: newSubName });
      setShowQuickAddSub(false);
      setNewSubName('');
    } catch (err) {
      toast({ variant: "destructive", title: "Creation Failed" });
    }
  };

  const getSafeImages = (imgData) => {
    if (!imgData) return [];
    if (Array.isArray(imgData)) return imgData;
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return [];
    }
  };

  const handleCategoryToggle = (catName) => {
    const current = Array.isArray(formData.category) ? formData.category : [];
    if (current.includes(catName)) {
      setFormData({ ...formData, category: current.filter(c => c !== catName), subCategory: '' });
    } else {
      setFormData({ ...formData, category: [...current, catName], subCategory: '' });
    }
  };

  const handleEdit = (prod) => {
    let parsedCategory = [];
    try {
      if (prod.category) {
        if (typeof prod.category === 'string' && prod.category.startsWith('[')) {
          parsedCategory = JSON.parse(prod.category);
        } else {
          parsedCategory = [prod.category]; // Backward compatibility
        }
      }
    } catch (e) {
      parsedCategory = [prod.category];
    }

    setEditingProd(prod);
    setFormData({
      ...prod,
      category: Array.isArray(parsedCategory) ? parsedCategory : [prod.category],
      images: [], 
      video: null
    });
    
    const imagesArray = getSafeImages(prod.images);
    const existingPreviews = imagesArray.map(img => img.startsWith('http') ? img : `${API_BASE}${img}`);
    setPreviewUrls(existingPreviews);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this product permanently?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      toast({ title: "Product Purged Successfully" });
    } catch (err) { 
      toast({ variant: "destructive", title: "Action Failed" }); 
    }
  };

  const handleFileChange = (e, type) => {
    if (type === 'video') {
      setFormData({ ...formData, video: e.target.files[0] });
    } else {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: files });
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData.images.forEach(img => data.append('images', img));
      } else if (key === 'video' && formData.video) {
        data.append('video', formData.video);
      } else if (key === 'category') {
        data.append('category', JSON.stringify(formData.category));
      } else if (formData[key] !== null && key !== 'images' && key !== 'video') {
        data.append(key, formData[key]);
      }
    });

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editingProd) {
        await API.put(`/products/${editingProd.id}`, data, config);
        toast({ title: "Product Updated Successfully" });
      } else {
        await API.post('/products', data, config);
        toast({ title: "New Product Deployed Ready" });
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast({ variant: "destructive", title: "Upload Failed" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProd(null);
    setPreviewUrls([]);
    setFormData({ 
      name: '', description: '', category: '', subCategory: '', moq: '', 
      gsm: '', durability: '', hsn: '', 
      status: 'Active', images: [], video: null 
    });
  };

  return (
    <>
      <div className="max-w-[1600px] mx-auto p-10 space-y-12 font-sans text-slate-900">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Product Management</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">Product Catalog</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-xs font-semibold hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
            <Plus size={18} /> Add New Product
          </button>
        </div>

        {loading ? (
          <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map(prod => {
              const imagesArray = getSafeImages(prod.images);
              return (
                <div key={prod.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                  <div className="h-48 rounded-2xl mb-6 overflow-hidden relative bg-slate-50 border border-slate-50">
                    <img 
                      src={imagesArray.length > 0 ? `${API_BASE}${imagesArray[0]}` : '/placeholder.jpg'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                      onError={(e) => { e.target.src = '/placeholder.jpg' }}
                      alt="" 
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEdit(prod)} className="p-2 bg-white/90 rounded-lg shadow-sm text-slate-600 hover:text-emerald-600"><Edit3 size={14}/></button>
                      <button onClick={() => handleDelete(prod.id)} className="p-2 bg-white/90 rounded-lg shadow-sm text-rose-500 hover:bg-rose-50"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase truncate">{prod.name}</h3>
                    {/* ⭐ Prices and stock removed from card footer */}
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest pt-2 border-t border-slate-50">
                      Status: {prod.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={closeModal}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-5xl rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-10 pb-6 border-b">
                  <h2 className="text-xl font-semibold text-slate-800">{editingProd ? 'Update Product' : 'Add New Product'}</h2>
                  <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-full transition-all text-gray-400"><X size={24}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                    <div className="space-y-1">
                       <label className="text-[9px] uppercase font-bold text-slate-400 ml-1">Product Name</label>
                       <input type="text" placeholder="Product Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>

                    {/* MULTI-SELECT CATEGORY UI */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold text-slate-400 ml-1">Main Categories (Select Multiple)</label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 border border-slate-100 rounded-xl min-h-[120px]">
                        {categories.filter(c => !c.parent_id).map(cat => (
                          <label key={cat.id} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer hover:text-emerald-600 transition-colors py-1">
                            <input 
                              type="checkbox" 
                              checked={(formData.category || []).includes(cat.name)}
                              onChange={() => handleCategoryToggle(cat.name)}
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            {cat.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 ml-1">Sub-Category</label>
                        {!showQuickAddSub && formData.category.length > 0 && (
                          <button type="button" onClick={() => setShowQuickAddSub(true)} className="text-[9px] text-emerald-600 font-bold hover:underline">+ NEW SUB</button>
                        )}
                      </div>

                      {showQuickAddSub ? (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="New Sub-Category Name" 
                            className="flex-1 p-3 bg-white border border-emerald-200 rounded-xl text-xs outline-none" 
                            value={newSubName} 
                            onChange={(e) => setNewSubName(e.target.value)} 
                          />
                          <button type="button" onClick={handleQuickAddSub} className="p-3 bg-emerald-600 text-white rounded-xl text-[10px]"><Plus size={14}/></button>
                          <button type="button" onClick={() => setShowQuickAddSub(false)} className="p-3 bg-slate-100 text-slate-400 rounded-xl text-[10px]"><X size={14}/></button>
                        </div>
                      ) : (
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium" value={formData.subCategory || ''} onChange={(e) => setFormData({...formData, subCategory: e.target.value})}>
                          <option value="">Select Sub-Category</option>
                          {categories.filter(c => {
                            const selectedParents = categories.filter(p => (formData.category || []).includes(p.name));
                            return selectedParents.some(p => p.id === c.parent_id);
                          }).map(sub => (
                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* ⭐ Optimized Description Box with Enter support */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Product Description</label>
                    <textarea 
                      placeholder="Technical properties... (Press Enter for new line)" 
                      rows="6" 
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed resize-none transition-all" 
                      style={{ whiteSpace: 'pre-wrap' }}
                      value={formData.description || ''} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>

                  {/* ⭐ Removed Retail Price, Bulk Price, and Stock Level row */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <input type="text" placeholder="HSN Code" className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs" value={formData.hsn || ''} onChange={(e) => setFormData({...formData, hsn: e.target.value})} />
                    <input type="text" placeholder="GSM" className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs" value={formData.gsm || ''} onChange={(e) => setFormData({...formData, gsm: e.target.value})} />
                    <input type="text" placeholder="Durability" className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs" value={formData.durability || ''} onChange={(e) => setFormData({...formData, durability: e.target.value})} />
                    <input type="text" placeholder="MOQ" className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs" value={formData.moq || ''} onChange={(e) => setFormData({...formData, moq: e.target.value})} />
                    <select className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs" value={formData.status || 'Active'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Active">Active</option><option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center hover:border-emerald-200 transition-all cursor-pointer">
                      <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'images')} />
                      <ImageIcon className="mx-auto mb-2 text-slate-200" size={32} />
                      <p className="text-[10px] font-bold uppercase text-slate-400">Upload Images (Up to 10)</p>
                      {previewUrls.length > 0 && <p className="text-[10px] text-emerald-600 mt-2 font-bold uppercase">{previewUrls.length} Images Selected</p>}
                    </div>
                    <div className="relative border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center hover:border-emerald-200 transition-all cursor-pointer">
                      <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'video')} />
                      <Video className="mx-auto mb-2 text-slate-200" size={32} />
                      <p className="text-[10px] font-bold uppercase text-slate-400">Upload Video</p>
                      {formData.video && <p className="text-[10px] text-emerald-600 mt-2 font-bold uppercase">Video Selected</p>}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-semibold uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-xl transition-all">
                      {editingProd ? 'Update Product' : 'Add Product'}
                    </button>
                    <button type="button" onClick={closeModal} className="px-8 bg-slate-100 text-slate-600 py-5 rounded-2xl font-semibold uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Cancel</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductManagement;

