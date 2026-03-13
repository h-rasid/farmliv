import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Camera, FileText, CheckCircle2, 
  Search, Users, ChevronRight, X, Play, Square, Activity
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VisitManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [activeVisit, setActiveVisit] = useState(null); // Current session
  const [visitNotes, setVisitNotes] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
    // Check for existing active session in localStorage
    const savedSession = localStorage.getItem('farmliv_active_visit');
    if (savedSession) setActiveVisit(JSON.parse(savedSession));
  }, []);

  const fetchCustomers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const res = await API.get(`/salesman/${user.id}/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.error("Node Retrieval Offline");
    }
  };

  const handleStartVisit = (customer) => {
    const session = {
      customer_id: customer.id,
      customer_name: customer.name,
      check_in: new Date().toISOString(),
      location: customer.location || "On-Site"
    };
    setActiveVisit(session);
    localStorage.setItem('farmliv_active_visit', JSON.stringify(session));
    toast({ title: `Check-in Successful: ${customer.name}` });
  };

  const handleEndVisit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const visitData = {
        ...activeVisit,
        salesman_id: user.id,
        check_out: new Date().toISOString(),
        notes: visitNotes,
        status: 'completed'
      };

      await API.post('/field-visits', visitData);
      
      setActiveVisit(null);
      setVisitNotes('');
      setSelectedCustomer(null);
      localStorage.removeItem('farmliv_active_visit');
      
      toast({ title: "Visit Protocol Synchronized" });
    } catch (err) {
      toast({ variant: "destructive", title: "Synchronization Failure" });
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24 font-sans">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">Visit Log</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Field Activity Calibration</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${activeVisit ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
        </header>

        <AnimatePresence mode="wait">
          {!activeVisit ? (
            <motion.div key="selector" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                   type="text" 
                   placeholder="Identify Destination Node..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
                 />
               </div>
               <div className="space-y-3">
                  {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                     <button 
                       key={c.id}
                       onClick={() => handleStartVisit(c)}
                       className="w-full p-6 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between group active:scale-95 transition-all"
                     >
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <Play size={16} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-black uppercase tracking-tight">{c.name}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.location || 'HQ'}</span>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-200 group-hover:text-emerald-500" />
                     </button>
                  ))}
               </div>
            </motion.div>
          ) : (
            <motion.div key="session" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl space-y-8 relative overflow-hidden">
                   <div className="relative z-10 flex justify-between items-start">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Engagement</span>
                         <span className="text-2xl font-black italic">{activeVisit.customer_name}</span>
                      </div>
                      <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-[8px] font-black uppercase tracking-widest animate-pulse border border-emerald-500/30">Active Session</div>
                   </div>

                   <div className="relative z-10 flex gap-6">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1 mb-1"><Clock size={10}/> Ignition</span>
                         <span className="text-xs font-bold">{new Date(activeVisit.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1 mb-1"><MapPin size={10}/> Coordinates</span>
                         <span className="text-xs font-bold">{activeVisit.location}</span>
                      </div>
                   </div>

                   <textarea 
                     rows="4"
                     placeholder="Log Field Intelligence..."
                     value={visitNotes}
                     onChange={(e) => setVisitNotes(e.target.value)}
                     className="relative z-10 w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-1 ring-emerald-500/50 transition-all placeholder:text-slate-600"
                   />

                   <div className="relative z-10 grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                         <Camera size={16} /> Image
                      </button>
                      <button 
                        onClick={handleEndVisit}
                        className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                         <Square size={14} fill="white" /> Terminate
                      </button>
                   </div>

                   {/* Background Element */}
                   <Activity className="absolute -bottom-10 -right-10 text-white/5 w-40 h-40 transform rotate-12" />
                </div>

                <button 
                  onClick={() => { if(window.confirm("Abort this session without logging?")) setActiveVisit(null); }}
                  className="w-full py-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-rose-400 transition-colors"
                >
                   Abort Security Protocol
                </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PortalLayout>
  );
};

export default VisitManagementPage;
