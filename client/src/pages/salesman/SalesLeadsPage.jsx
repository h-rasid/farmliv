import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  Star, Search, Phone, Mail, MapPin, 
  ChevronRight, Calendar, AlertCircle, CheckCircle2,
  Clock, Filter, Plus
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const res = await API.get(`/salesman/${user.id}/leads`);
      setLeads(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Lead Sync Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/leads/${id}/status`, { status });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast({ title: `Lead moved to ${status.toUpperCase()}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Update Error" });
    }
  };

  const filtered = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.product_interest?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600';
      case 'contacted': return 'bg-amber-50 text-amber-600';
      case 'follow-up': return 'bg-purple-50 text-purple-600';
      case 'negotiation': return 'bg-indigo-50 text-indigo-600';
      case 'converted': return 'bg-emerald-50 text-emerald-600';
      case 'lost': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic">My Leads</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{leads.length} Potential Conversions</p>
          </div>
          <button className="p-3 bg-slate-900 text-white rounded-2xl">
             <Filter size={20} />
          </button>
        </header>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Find Potential Client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
          />
        </div>

        <section className="space-y-4">
          {filtered.map(lead => (
            <motion.div 
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-6 space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{lead.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lead.product_interest || 'General Inquiry'}</span>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <a href={`tel:${lead.phone}`} className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    <Phone size={14} /> Call
                 </a>
                 <a href={`mailto:${lead.email}`} className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    <Mail size={14} /> Email
                 </a>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                 <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                    <Clock size={12} /> Assigned {new Date(lead.created_at).toLocaleDateString()}
                 </div>
                 <select 
                   onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                   value={lead.status}
                   className="text-[9px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg outline-none"
                 >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="converted">Convert</option>
                    <option value="lost">Lost</option>
                 </select>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="py-20 text-center">
               <Star size={40} className="mx-auto text-slate-100 mb-4" />
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No Active Leads Found</p>
            </div>
          )}
        </section>
      </div>
    </PortalLayout>
  );
};

export default SalesLeadsPage;
