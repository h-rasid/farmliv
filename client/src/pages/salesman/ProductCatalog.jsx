import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, Filter, IndianRupee, 
  Info, ChevronRight, CheckCircle2, AlertCircle,
  Tag, Layers, Activity, Target, ArrowUpRight,
  ShieldCheck, Globe, MoreHorizontal, Star,
  Boxes, LayoutGrid, List, Sparkles, Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { toast } = useToast();

  const fetchCatalog = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories')
      ]);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      toast({ variant: "destructive", title: "Catalog Sync Interrupted" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const filtered = (Array.isArray(products) ? products : []).filter(p => {
    if (!p) return false;
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <PortalLayout role="salesman">
      <div className="flex flex-col gap-8">
        
        {/* HEADER & INVENTORY PULSE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Inventory Nexus</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Asset Stream</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Total Assets</span>
                   <span className="text-base font-black italic text-slate-900">{products.length}</span>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                   <Boxes size={18} />
                </div>
             </div>
             <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <List size={18} />
                </button>
             </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-6">
           <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group w-full">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                 <input 
                    type="text" 
                    placeholder="Identify Product by Nomenclature or SKU Vector..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-4 ring-emerald-500/5 outline-none shadow-sm transition-all font-medium"
                 />
              </div>
           </div>

           <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
              >
                 Global Registry
              </button>
              {categories.map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => setSelectedCategory(cat.id)}
                   className={`flex-shrink-0 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
                 >
                    {cat.name}
                 </button>
              ))}
           </div>
        </div>

        {/* INVENTORY GRID */}
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
           <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                 <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={product.id}
                    className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col gap-6 relative overflow-hidden"
                 >
                    {/* Design Flourish */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start relative z-10">
                       <div className="flex flex-col">
                          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic leading-snug group-hover:text-emerald-600 transition-colors">
                             {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                             <Tag size={10} className="text-slate-300" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.sku || 'FML-0112'}</span>
                          </div>
                       </div>
                       <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                          <Sparkles size={18} />
                       </div>
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                       <div className="flex items-baseline gap-1">
                          <IndianRupee size={14} className="text-emerald-500 font-bold" />
                          <span className="text-2xl font-black italic tracking-tighter text-slate-900">
                             {parseFloat(product.price).toLocaleString()}
                          </span>
                       </div>
                       <div className={`px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${product.stock > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                          {product.stock > 0 ? <Zap size={10} className="fill-current" /> : <AlertCircle size={10} />}
                          {product.stock > 0 ? 'Verified' : 'Logistics Lag'}
                       </div>
                    </div>

                    <div className="p-5 bg-slate-50/50 rounded-[2rem] border border-slate-50 relative z-10">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available Units</span>
                             <span className="text-[11px] font-black text-slate-800 uppercase italic mt-1">{product.stock} Units</span>
                          </div>
                          <div className="flex flex-col text-right">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol Type</span>
                             <span className="text-[11px] font-black text-slate-800 uppercase italic mt-1">Retail Apex</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10 mt-auto">
                       <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                          <Layers size={14} /> Batch {product.id.toString().padStart(4, '0')}
                       </div>
                       <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 group/btn">
                          Specs Matrix <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </motion.div>
              ))}
           </AnimatePresence>
        </div>

        {filtered.length === 0 && !loading && (
           <div className="py-32 flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                 <Package size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Zero Registry Hits</h3>
              <p className="max-w-xs text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">No inventory assets detected within the current search or category matrix.</p>
           </div>
        )}

        {loading && (
           <div className="py-32 flex items-center justify-center">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              </div>
           </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default ProductCatalog;
