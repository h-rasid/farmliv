import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Phone, Mail, MapPin, 
  Building2, ChevronRight, UserCheck, Star,
  Globe, ShieldCheck, Zap, MoreHorizontal,
  ArrowUpRight, ListFilter, Map as MapIcon, Grid3X3
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await API.get(`/salesman/${user.id}/customers`);
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Network Sync Failed:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = (Array.isArray(customers) ? customers : []).filter(c => {
    if (!c) return false;
    const name = c.name || "";
    const company = c.company || "";
    const location = c.location || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           company.toLowerCase().includes(searchTerm.toLowerCase()) ||
           location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="flex flex-col gap-8">
        
        {/* HEADER & NETWORK PULSE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Network Hub</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Nodes Synchronized</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white p-1 rounded-2xl border border-slate-100 flex shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
                >
                   <Grid3X3 size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
                >
                   <ListFilter size={18} />
                </button>
             </div>
             <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center gap-2">
                <Globe size={16} /> Global View
             </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Network Identity by Name, Company, or Location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[2.5rem] text-sm focus:ring-4 ring-emerald-500/5 outline-none shadow-sm transition-all font-medium"
          />
        </div>

        {/* CUSTOMERS GRID/LIST */}
        <div className={`grid gap-6 pb-20 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filtered.map(customer => (
            <motion.div 
              layout
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className={`bg-white border border-slate-100 group transition-all hover:shadow-2xl hover:shadow-slate-200/50 ${viewMode === 'grid' ? 'p-8 rounded-[3rem] flex flex-col gap-6' : 'p-6 rounded-[2rem] flex items-center gap-6'}`}
            >
               {/* Identity Section */}
               <div className={`flex items-center gap-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all border border-transparent group-hover:border-emerald-100">
                     <Building2 size={24} />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-base font-black text-slate-900 uppercase tracking-tighter italic truncate">{customer.name}</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{customer.company || "Individual Farmer"}</span>
                  </div>
               </div>

               {/* Meta Details */}
               <div className={`flex flex-col gap-3 ${viewMode === 'list' ? 'flex-2 hidden md:flex' : 'flex-1 border-t border-slate-50 pt-6 mt-2'}`}>
                  <div className="flex items-center gap-2 text-slate-500">
                     <MapPin size={14} className="shrink-0" />
                     <span className="text-[10px] font-bold uppercase tracking-tight truncate">{customer.location || "Location Not Specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                     <ShieldCheck size={14} className="shrink-0 text-emerald-500" />
                     <span className="text-[10px] font-bold uppercase tracking-tight">{customer.type} • Verified Partner</span>
                  </div>
               </div>

               {/* Actions */}
               <div className={`flex items-center gap-2 ${viewMode === 'list' ? '' : 'mt-auto pt-2'}`}>
                  <a href={`tel:${customer.phone}`} className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">
                     <Phone size={18} />
                  </a>
                  <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all flex-1 flex justify-center">
                     <ChevronRight size={18} />
                  </button>
               </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-32 text-center">
               <motion.div 
                 animate={{ rotate: [0, 10, -10, 0] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="inline-block"
               >
                 <Users size={64} className="text-slate-100 mb-6" />
               </motion.div>
               <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">Identity Discovery Failed</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Broaden identification parameters for node detection</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesCustomersPage;
