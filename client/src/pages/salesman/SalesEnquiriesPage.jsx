import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Phone, Mail, MapPin, 
  MessageSquare, User, Calendar, 
  ChevronRight, Search, Clock,
  Filter, Activity, Target, ArrowUpRight,
  ShieldCheck, Globe, MoreHorizontal,
  Star, AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  const fetchEnquiries = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await API.get(`/quick-enquiries/salesman/${user.id}`);
      setEnquiries(res.data);
      setFilteredEnquiries(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Enquiry Feed Offline" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  useEffect(() => {
    let result = enquiries.filter(e => 
      e.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone?.includes(searchTerm)
    );

    if (filterStatus !== 'all') {
      result = result.filter(e => e.status?.toLowerCase() === filterStatus.toLowerCase());
    }

    setFilteredEnquiries(result);
  }, [searchTerm, filterStatus, enquiries]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'new') return 'bg-blue-50 text-blue-600 border-blue-100';
    if (s === 'contacted') return 'bg-amber-50 text-amber-600 border-amber-100';
    if (s === 'closed') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
  };

  return (
    <PortalLayout role="salesman">
      <div className="flex flex-col gap-8">
        
        {/* HEADER & INTELLIGENCE PULSE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Intelligence Inflow</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live B2B Signal Stream</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                <Target size={14} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Nodes: {enquiries.length}</span>
             </div>
             <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2">
                <Activity size={16} /> Signal Stats
             </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                 type="text" 
                 placeholder="Identify Enquiry Source or Contact Node..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-4 ring-amber-500/5 outline-none shadow-sm transition-all font-medium"
              />
           </div>
           <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-full md:w-auto">
              {['all', 'new', 'contacted', 'closed'].map((s) => (
                 <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    {s}
                 </button>
              ))}
           </div>
        </div>

        {/* INTELLIGENCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <AnimatePresence mode="popLayout">
              {filteredEnquiries.map((enq) => (
                 <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={enq.id}
                    className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col gap-6 group relative overflow-hidden"
                 >
                    {/* Priority Burst */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start relative z-10">
                       <div className="flex flex-col">
                          <span className="text-base font-black text-slate-900 uppercase tracking-tighter italic truncate">{enq.customer_name}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{enq.company || "Independent Entity"}</span>
                       </div>
                       <div className={`px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest ${getStatusColor(enq.status)}`}>
                          {enq.status}
                       </div>
                    </div>

                    <div className="p-5 bg-slate-50/50 rounded-[2rem] border border-slate-50 flex flex-col gap-3 relative z-10">
                       <div className="flex items-center gap-2 text-slate-300">
                          <MessageSquare size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Protocol Directives</span>
                       </div>
                       <p className="text-[11px] font-bold text-slate-600 italic leading-relaxed line-clamp-3">
                          "{enq.notes || "No specific strategic requirements provided by the node."}"
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                       <a href={`tel:${enq.phone}`} className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/10">
                          <Phone size={14} /> Dial
                       </a>
                       <a href={`mailto:${enq.email}`} className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all">
                          <Mail size={14} /> Mail
                       </a>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 relative z-10">
                       <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                          <Clock size={12} /> {new Date(enq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                       </div>
                       <button className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 group/btn">
                          Action <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </motion.div>
              ))}
           </AnimatePresence>
        </div>

        {filteredEnquiries.length === 0 && !loading && (
           <div className="py-32 flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                 <Zap size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Zero Signal Vectors</h3>
              <p className="max-w-xs text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">No active quick enquiries detected within the assigned sector parameters.</p>
           </div>
        )}

        {loading && (
           <div className="py-32 flex items-center justify-center">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              </div>
           </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default SalesEnquiriesPage;
