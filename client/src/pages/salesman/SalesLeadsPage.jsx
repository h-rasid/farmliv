import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Search, Phone, Mail, MapPin, 
  ChevronRight, Calendar, AlertCircle, CheckCircle2,
  Clock, Filter, Plus, Target, Users, Zap,
  TrendingUp, ArrowUpRight, MessageCircle, MoreVertical
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await API.get(`/salesman/${user.id}/leads`);
      setLeads(res.data);
    } catch (err) {
      console.error("Lead Sync Failed:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/leads/${id}/status`, { status });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast({ title: `Operational Status: ${status.toUpperCase()}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Update Protocol Fault" });
    }
  };

  const filtered = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.product_interest?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        l.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'follow-up': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'negotiation': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'converted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'lost': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    converted: leads.filter(l => l.status === 'converted').length,
    pending: leads.filter(l => ['contacted', 'follow-up', 'negotiation'].includes(l.status)).length
  };

  return (
    <PortalLayout role="salesman">
      <div className="flex flex-col gap-8">
        
        {/* HEADER & ANALYTICS PULSE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Lead Hub</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Lead Synchronization</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 px-4 py-3">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Conversion Rate</span>
                  <div className="flex items-center gap-1">
                     <span className="text-lg font-black text-slate-900 leading-none">
                       {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%
                     </span>
                     <TrendingUp size={12} className="text-emerald-500" />
                  </div>
               </div>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2">
               <Plus size={16} /> New Lead
            </button>
          </div>
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { label: 'Total Inflow', val: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Fresh Requests', val: stats.new, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
             { label: 'In Pipeline', val: stats.pending, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
             { label: 'Success Nodes', val: stats.converted, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           ].map((s, idx) => (
             <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}>
                   <s.icon size={18} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</span>
                   <span className="text-xl font-black text-slate-900 tracking-tighter italic leading-none">{s.val}</span>
                </div>
             </div>
           ))}
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name, company, or product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
             {['all', 'new', 'contacted', 'follow-up', 'negotiation', 'converted', 'lost'].map(s => (
               <button 
                 key={s}
                 onClick={() => setFilterStatus(s)}
                 className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filterStatus === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
               >
                 {s}
               </button>
             ))}
          </div>
        </div>

        {/* LEADS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
          {filtered.map(lead => (
            <motion.div 
              layout
              key={lead.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group lg:min-h-[320px]"
            >
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                       <Target size={20} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-base font-black text-slate-900 uppercase tracking-tighter italic leading-none truncate w-32 md:w-40">{lead.name}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{lead.company || "Farmliv Partner"}</span>
                    </div>
                 </div>
                 <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-dashed ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                 </div>
              </div>

              <div className="flex-1 space-y-4">
                 <div className="flex flex-col gap-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Interest</span>
                    <span className="text-xs font-bold text-slate-700 italic">{lead.product_interest || 'General High-Value Inquiry'}</span>
                 </div>
                 
                 <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1">
                       <MapPin size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-tighter">{lead.location || "North East Hub"}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                       <Clock size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-tighter">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                 <a href={`tel:${lead.phone}`} className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/10">
                    <Phone size={14} /> Call Now
                 </a>
                 <div className="bg-slate-50 rounded-2xl flex">
                    <select 
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      value={lead.status}
                      className="w-full bg-transparent text-[9px] font-black uppercase tracking-widest px-4 outline-none cursor-pointer"
                    >
                       <option value="new">Phase: New</option>
                       <option value="contacted">Phase: Contacted</option>
                       <option value="follow-up">Phase: Follow-up</option>
                       <option value="negotiation">Phase: Negotiate</option>
                       <option value="converted">Result: Convert</option>
                       <option value="lost">Result: Defer</option>
                    </select>
                 </div>
              </div>
            </motion.div>
          ))}
          
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center"
              >
                 <Target size={48} className="mx-auto text-slate-100 mb-6 animate-bounce" />
                 <h3 className="text-xl font-black text-slate-300 uppercase tracking-[0.3em] italic">No active nodes in query</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Adjust filtering parameters to broaden identification</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PortalLayout>
  );
};

export default SalesLeadsPage;
