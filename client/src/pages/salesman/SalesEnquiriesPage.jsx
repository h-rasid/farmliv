import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  Zap, Phone, Mail, MapPin, 
  MessageSquare, User, Calendar, 
  ChevronRight, Search, Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const res = await API.get(`/quick-enquiries/salesman/${user.id}`);
      setEnquiries(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Enquiry Feed Offline" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24 font-sans text-slate-900">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">Quick Enquiries</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{enquiries.length} Assigned B2B Nodes</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-[1.5rem] flex items-center justify-center">
             <Zap size={24} fill="currentColor" />
          </div>
        </header>

        <section className="space-y-4">
           {enquiries.map(enq => (
              <motion.div 
                key={enq.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 group overflow-hidden relative"
              >
                 <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col">
                       <span className="text-xs font-black uppercase tracking-tight text-slate-900">{enq.customer_name}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{enq.company || 'Private Entity'}</span>
                    </div>
                    <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                       {enq.status}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 relative z-10">
                    <a href={`tel:${enq.phone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                       <Phone size={14} />
                       <span className="text-[10px] font-black uppercase tracking-tighter">Dial Hub</span>
                    </a>
                    <a href={`mailto:${enq.email}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                       <Mail size={14} />
                       <span className="text-[10px] font-black uppercase tracking-tighter">Mail Node</span>
                    </a>
                 </div>

                 <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                       <MessageSquare size={12} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Requirement Protocols</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 italic leading-relaxed">
                       "{enq.notes || 'No custom directives provided.'}"
                    </p>
                 </div>

                 <div className="flex items-center justify-between pt-2 relative z-10">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                       <Clock size={12}/> Received {new Date(enq.created_at).toLocaleDateString()}
                    </div>
                    <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group/btn">
                       Processing <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                    </button>
                 </div>

                 {/* Design Burst */}
                 <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />
              </motion.div>
           ))}
           {enquiries.length === 0 && !loading && (
              <div className="py-20 text-center opacity-30">
                 <Zap size={40} className="mx-auto mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero Quick Enquiries Assigned</p>
              </div>
           )}
        </section>
      </div>
    </PortalLayout>
  );
};

export default SalesEnquiriesPage;
