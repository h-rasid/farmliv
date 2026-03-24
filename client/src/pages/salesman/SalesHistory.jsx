import React, { useState, useEffect, useCallback } from 'react';

import API from '@/utils/axios';
import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, Calendar, User, IndianRupee, 
  Package, History, Search, Filter,
  ArrowUpRight, Download, MoreHorizontal,
  ChevronRight, CheckCircle2, Clock, 
  Activity, ShieldCheck, Globe
} from 'lucide-react';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchSalesHistory = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const cleanId = user.id.toString().split(':')[0];
      const res = await API.get(`/sales/salesman/${cleanId}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setSales(data);
      setFilteredSales(data);
    } catch (err) {
      console.error("History Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesHistory();
  }, [fetchSalesHistory]);

  useEffect(() => {
    const data = Array.isArray(sales) ? sales : [];
    let result = data.filter(s => {
      if (!s) return false;
      return s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             s.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             s.id?.toString().includes(searchTerm);
    });
    
    if (filterType !== 'all') {
      result = result.filter(s => s.payment_method?.toLowerCase() === filterType);
    }
    
    setFilteredSales(result);
  }, [searchTerm, filterType, sales]);

  return (
    <>
      <div className="flex flex-col gap-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
           <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Transaction Archives</h1>
              <div className="flex items-center gap-2 mt-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Field Conversions</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <History size={16} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Operational Yield</span>
                    <span className="text-base font-black italic">{sales.length} Verified Entries</span>
                 </div>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2">
                 <Download size={16} /> Ledger Export
              </button>
           </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                 type="text" 
                 placeholder="Identify Transaction ID or Entity Node..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-4 ring-emerald-500/5 outline-none shadow-sm transition-all font-medium"
              />
           </div>
           <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-full md:w-auto">
              {['all', 'cash', 'credit', 'online'].map((t) => (
                 <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterType === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    {t}
                 </button>
              ))}
           </div>
        </div>

        {/* DATA MATRIX */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden group">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vector ID</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Merchant Entity</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Asset Profile</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valuation</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                       <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Auth</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                       {filteredSales.map((sale) => (
                          <motion.tr 
                             layout
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             key={sale.id} 
                             className="hover:bg-slate-50/50 transition-colors group/row"
                          >
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover/row:bg-emerald-50 group-hover/row:text-emerald-600 transition-all border border-transparent group-hover/row:border-emerald-100">
                                      <Receipt size={18} />
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-black text-slate-900 tracking-wider">TRX-{sale.id.toString().padStart(6, '0')}</span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">Internal Log</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8 text-sm font-black text-slate-800 uppercase italic tracking-tight">{sale.customer_name}</td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-2">
                                   <Package size={14} className="text-slate-300" />
                                   <span className="text-[11px] font-bold text-slate-500 uppercase">{sale.product_name}</span>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-1 text-emerald-600 font-black italic text-lg leading-none">
                                   <IndianRupee size={16} /> 
                                   {parseFloat(sale.final_price).toLocaleString()}
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${sale.payment_method === 'cash' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                      {sale.payment_method}
                                   </span>
                                </div>
                             </td>
                             <td className="px-10 py-8 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                {new Date(sale.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="inline-flex p-2 items-center justify-center text-emerald-500 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                                   <ShieldCheck size={18} />
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                    </AnimatePresence>
                 </tbody>
              </table>
           </div>
           
           {(filteredSales.length === 0 && !loading) && (
              <div className="py-32 flex flex-col items-center justify-center text-center px-10">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <Activity size={40} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Null Data Vector</h3>
                 <p className="max-w-xs text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">No transactional records detected within the specified search parameters.</p>
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
      </div>
    </>
  );
};

export default SalesHistory;
