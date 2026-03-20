import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Camera, FileText, CheckCircle2, 
  Search, Users, ChevronRight, X, Play, Square, Activity,
  Target, Zap, Navigation, ArrowUpRight, ShieldCheck,
  Calendar, MoreVertical, Map as MapIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VisitManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [activeVisit, setActiveVisit] = useState(null);
  const [visitNotes, setVisitNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await API.get(`salesman/${user.id}/customers`);
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Node Retrieval Offline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    const savedSession = localStorage.getItem('farmliv_active_visit');
    if (savedSession) setActiveVisit(JSON.parse(savedSession));
  }, [fetchCustomers]);

  const handleStartVisit = (customer) => {
    const session = {
      customer_id: customer.id,
      customer_name: customer.name,
      check_in: new Date().toISOString(),
      location: customer.location || "On-Site"
    };
    setActiveVisit(session);
    localStorage.setItem('farmliv_active_visit', JSON.stringify(session));
    toast({ title: "Infiltration Protocol Started", description: `Check-in identity: ${customer.name}` });
  };

  const handleEndVisit = async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      const user = JSON.parse(userStr);
      const visitData = {
        ...activeVisit,
        salesman_id: user.id,
        check_out: new Date().toISOString(),
        notes: visitNotes,
        status: 'completed'
      };

      await API.post('field-visits', visitData);
      
      setActiveVisit(null);
      setVisitNotes('');
      localStorage.removeItem('farmliv_active_visit');
      toast({ title: "Protocol Synchronized", description: "Visit intelligence recorded successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Synchronization Failure" });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        
        {/* HEADER & ANALYTICS PULSE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Field Console</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${activeVisit ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {activeVisit ? "Infiltration Active" : "Logistics standby"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                <Navigation size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Deployments: {customers.length}</span>
             </div>
             <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2">
                <MapIcon size={16} /> Satellite View
             </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!activeVisit ? (
            <motion.div 
              key="selector" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
               {/* SEARCH BAR */}
               <div className="relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                 <input 
                   type="text" 
                   placeholder="Identify Destination Node for Deployment..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[2.5rem] text-sm focus:ring-4 ring-emerald-500/5 outline-none shadow-sm transition-all font-medium"
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(Array.isArray(customers) ? customers : []).filter(c => {
                    if (!c) return false;
                    return c.name.toLowerCase().includes(searchTerm.toLowerCase());
                  }).map(c => (
                     <motion.button 
                       whileHover={{ y: -5 }}
                       key={c.id}
                       onClick={() => handleStartVisit(c)}
                       className="bg-white p-8 rounded-[3rem] border border-slate-100 text-left hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col gap-6 group"
                     >
                        <div className="flex justify-between items-start">
                           <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                              <Target size={24} />
                           </div>
                           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={16} fill="currentColor" />
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-base font-black text-slate-900 uppercase tracking-tighter italic truncate">{c.name}</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{c.company || "Independent Entity"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 mt-auto">
                           <MapPin size={12} />
                           <span className="text-[10px] font-bold uppercase tracking-tight">{c.location || "North East Segment"}</span>
                        </div>
                     </motion.button>
                  ))}
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="active-session"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
               {/* MAIN CONSOLE */}
               <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                     {/* Glass Overlay */}
                     <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] -mr-48 -mt-48 opacity-10 group-hover:opacity-20 transition-opacity" />
                     
                     <div className="relative z-10 flex flex-col gap-10">
                        <div className="flex justify-between items-start">
                           <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                 <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Live Telemetry</span>
                              </div>
                              <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{activeVisit.customer_name}</h2>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-black">Field Operational Status: Active Engagement</p>
                           </div>
                           <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-emerald-400 backdrop-blur-xl">
                              <Activity size={32} />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-md">
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                                 <Clock size={12} className="text-emerald-500" /> Start Vector
                              </span>
                              <span className="text-lg font-black italic">{new Date(activeVisit.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                                 <Navigation size={12} className="text-emerald-500" /> Site ID
                              </span>
                              <span className="text-lg font-black italic truncate">{activeVisit.location}</span>
                           </div>
                           <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                                 <ShieldCheck size={12} className="text-emerald-500" /> Protocol
                              </span>
                              <span className="text-lg font-black italic text-emerald-400 uppercase tracking-tighter">Standard Auth</span>
                           </div>
                        </div>

                        <div className="flex flex-col gap-4">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Field Intelligence Input</span>
                              <span className="text-[8px] font-black text-slate-600 uppercase italic">Recording Encrypted</span>
                           </div>
                           <textarea 
                             rows="5"
                             placeholder="Capture strategic insights, dealer requirements, and field data..."
                             value={visitNotes}
                             onChange={(e) => setVisitNotes(e.target.value)}
                             className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm outline-none focus:ring-4 ring-emerald-500/10 transition-all placeholder:text-slate-600 italic font-medium"
                           />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                           <button className="flex-1 flex items-center justify-center gap-3 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95 shadow-lg">
                              <Camera size={20} /> Image Capture
                           </button>
                           <button 
                             onClick={handleEndVisit}
                             className="flex-1 flex items-center justify-center gap-3 py-6 bg-emerald-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 active:scale-95 transition-all"
                           >
                              <Square size={16} fill="white" /> Terminate & Sync
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* SIDEBAR LOGS */}
               <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col gap-8">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic leading-none">Intelligence Stream</h3>
                        <MoreVertical size={16} className="text-slate-300" />
                     </div>
                     
                     <div className="space-y-6">
                        {[
                          { time: 'T-Minus 2m', event: 'Vector Alignment', desc: 'Signal synchronized with terminal.' },
                          { time: 'T-Minus 5m', event: 'Identity Verification', desc: 'Merchant node credentials updated.' },
                          { time: 'T-Minus 8m', event: 'Check-in Recorded', desc: 'Coordinates logged in mainframe.' },
                        ].map((log, i) => (
                           <div key={i} className="flex gap-4 group">
                              <div className="flex flex-col items-center">
                                 <div className="w-2 h-2 rounded-full bg-slate-200 group-first:bg-emerald-500" />
                                 <div className="w-0.5 h-full bg-slate-50 group-last:hidden" />
                              </div>
                              <div className="flex flex-col gap-1 pb-4">
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic">{log.event}</span>
                                 <span className="text-[10px] font-medium text-slate-400">{log.desc}</span>
                              </div>
                           </div>
                        ))}
                     </div>

                     <button 
                        onClick={() => { if(window.confirm("Abort this session without logging?")) { setActiveVisit(null); localStorage.removeItem('farmliv_active_visit'); } }}
                        className="w-full py-4 mt-4 border border-rose-50 text-rose-400 hover:bg-rose-50 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                        Abort Security Protocol
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default VisitManagementPage;
