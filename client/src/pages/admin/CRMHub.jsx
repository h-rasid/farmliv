import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';

import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Target, Clock, CheckCircle2, 
  Search, Filter, Plus, ChevronRight, Briefcase, 
  MessageSquare, UserPlus
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CRMHub = () => {
  const [pipeline, setPipeline] = useState({
    new: [],
    contacted: [],
    negotiation: [],
    converted: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      const res = await API.get('/admin/leads');
      const data = Array.isArray(res.data) ? res.data : [];
      setPipeline({
        new: data.filter(l => l.status === 'new'),
        contacted: data.filter(l => l.status === 'contacted' || l.status === 'follow-up'),
        negotiation: data.filter(l => l.status === 'negotiation'),
        converted: data.filter(l => l.status === 'converted')
      });
    } catch (err) {
      console.error("Pipeline Calibration Error");
    } finally {
      setLoading(false);
    }
  };

  const Column = ({ title, leads, colorClass }) => (
    <div className="flex flex-col gap-4 min-w-[300px] flex-1">
      <div className={`p-6 rounded-[2rem] border border-slate-100 bg-white flex justify-between items-center shadow-sm`}>
         <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[1].replace('text-', 'bg-')}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{title}</span>
         </div>
         <span className="text-[10px] font-black text-slate-300">{leads.length}</span>
      </div>
      <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
         {leads.map(lead => (
            <motion.div 
               key={lead.id} 
               whileHover={{ y: -5 }}
               className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm space-y-3 group cursor-pointer"
            >
               <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tighter truncate w-40">{lead.name}</span>
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-300 group-hover:text-emerald-500 transition-colors">
                     <ChevronRight size={14} />
                  </div>
               </div>
               <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <Briefcase size={10} /> {lead.product_interest || 'Hardware Inquiry'}
               </div>
               <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black">?</div>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase italic">{new Date(lead.created_at).toLocaleDateString()}</span>
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-[1450px] mx-auto p-6 md:p-10 space-y-10 font-sans text-slate-900">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Lead Pipeline</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">Track and manage customer opportunities</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                <Search size={16} className="text-slate-300" />
                <input type="text" placeholder="Search leads..." className="bg-transparent border-none outline-none text-[10px] uppercase font-black tracking-widest w-32" />
             </div>
             <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all">
                <UserPlus size={16} /> Add New Lead
             </button>
          </div>
        </header>

        <div className="flex gap-8 overflow-x-auto pb-10 custom-scrollbar">
           <Column title="New Leads" leads={pipeline.new} colorClass="text-blue-500" />
           <Column title="In Progress" leads={pipeline.contacted} colorClass="text-amber-500" />
           <Column title="Negotiation" leads={pipeline.negotiation} colorClass="text-indigo-500" />
           <Column title="Conversion" leads={pipeline.converted} colorClass="text-emerald-500" />
        </div>
      </div>
    </>
  );
};

export default CRMHub;
