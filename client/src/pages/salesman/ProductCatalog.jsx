import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  Package, Search, Filter, IndianRupee, 
  Info, ChevronRight, CheckCircle2, AlertCircle,
  Tag, Layers
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Catalog Sync Interrupted" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24 font-sans text-slate-900">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">Catalog</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{filtered.length} Indexed Assets</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center">
             <Package size={24} />
          </div>
        </header>

        <div className="space-y-4">
           <div className="relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
             <input 
               type="text" 
               placeholder="Identify Product..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
             />
           </div>

           <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${selectedCategory === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
              >
                 All Matrix
              </button>
              {categories.map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => setSelectedCategory(cat.id)}
                   className={`flex-shrink-0 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
                 >
                    {cat.name}
                 </button>
              ))}
           </div>
        </div>

        <section className="grid grid-cols-1 gap-4">
           {filtered.map(product => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                 <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                       <span className="text-xs font-black uppercase tracking-tight text-slate-900">{product.name}</span>
                       <span className="text-[10px] font-bold text-slate-300 uppercase italic">{product.sku || 'FML-0112'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                       <IndianRupee size={12} strokeWidth={3} />
                       <span className="text-lg font-black italic tracking-tighter">{product.price.toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                       <div className={`px-3 py-1 rounded-lg flex items-center gap-1.5 ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {product.stock > 0 ? <CheckCircle2 size={10}/> : <AlertCircle size={10}/>}
                          <span className="text-[8px] font-black uppercase tracking-widest">{product.stock > 0 ? 'In Stock' : 'Depleted'}</span>
                       </div>
                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Q3 Inventory</span>
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                       <Info size={16} />
                    </button>
                 </div>
              </motion.div>
           ))}
           {filtered.length === 0 && (
              <div className="py-20 text-center text-slate-300 uppercase">
                 <Search size={40} className="mx-auto mb-4 opacity-10" />
                 <p className="text-[10px] font-black tracking-[0.2em]">Zero Match Protocol</p>
              </div>
           )}
        </section>
      </div>
    </PortalLayout>
  );
};

export default ProductCatalog;
