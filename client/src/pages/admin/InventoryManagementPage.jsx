import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Package, AlertTriangle, TrendingDown, 
  Search, Filter, Plus, Edit3, Trash2, 
  Truck, Archive, ArrowRightLeft, Layers
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InventoryManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Inventory Sync Failed" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStock === 'Low') return matchesSearch && p.stock <= 10;
    if (filterStock === 'Out') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  return (
    <PortalLayout role="admin">
      <div className="max-w-[1450px] mx-auto p-6 md:p-10 space-y-8 font-sans text-slate-900">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Inventory Control</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">Supply Chain Asset Monitoring</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">
              <Archive size={16} /> Batch Audit
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-black/10">
              <Plus size={16} /> Add Stock Unit
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Quick Action Filters */}
           {['All', 'Low', 'Out'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterStock(type)}
                className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                  filterStock === type ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col items-start">
                   <span className="text-[10px] font-black uppercase tracking-widest">{type} Inventory</span>
                   <span className="text-xl font-black tracking-tighter">
                     {type === 'All' ? products.length : products.filter(p => type === 'Low' ? p.stock <= 10 : p.stock === 0).length}
                   </span>
                </div>
                <div className={`p-2 rounded-xl ${filterStock === type ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                   {type === 'All' ? <Layers size={18}/> : type === 'Low' ? <AlertTriangle size={18} className="text-amber-500"/> : <TrendingDown size={18} className="text-rose-500"/>}
                </div>
              </button>
           ))}
           <div className="relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
             <input 
                type="text" 
                placeholder="Search Identity..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 h-full bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
             />
           </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                  <th className="py-6 px-8">Asset Profile</th>
                  <th className="py-6 px-4">Classification</th>
                  <th className="py-6 px-4 text-center">Current Vol.</th>
                  <th className="py-6 px-4">Threshold status</th>
                  <th className="py-6 px-4">Warehouse</th>
                  <th className="py-6 px-8 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="py-6 px-8">
                       <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{prod.name}</span>
                       <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">HSN: {prod.hsn || '8414'}</p>
                    </td>
                    <td className="py-6 px-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{prod.category}</span>
                    </td>
                    <td className="py-6 px-4">
                       <div className="flex justify-center flex-col items-center">
                          <span className="text-sm font-black text-slate-900">{prod.stock}</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Units Active</span>
                       </div>
                    </td>
                    <td className="py-6 px-4">
                       <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                         prod.stock === 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                         prod.stock <= 10 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                         'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                         {prod.stock === 0 ? 'Critical Out' : prod.stock <= 10 ? 'Low Stock' : 'Synchronized'}
                       </div>
                    </td>
                    <td className="py-6 px-4">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Truck size={12} className="text-slate-200" /> HQ Warehouse
                       </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                             <ArrowRightLeft size={16} />
                          </button>
                          <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                             <Edit3 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Database size={40} className="mx-auto text-slate-100 mb-4" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No Synchronized Inventory Nodes Found</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default InventoryManagementPage;
