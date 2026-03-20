import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Phone, Mail, MapPin, 
  Target, Zap, MessageCircle, X,
  Building2, ChevronRight, Calendar,
  FileText, ArrowUpRight
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const { toast } = useToast();

  const fetchEnquiries = useCallback(async (isQuiet = false) => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await API.get(`quick-enquiries/salesman/${user.id}`);
      setEnquiries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Enquiry Feed Offline:", err.message);
    } finally {
      if (!isQuiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
    const iv = setInterval(() => fetchEnquiries(true), 10000);
    return () => clearInterval(iv);
  }, [fetchEnquiries]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`quick-enquiries/${id}/status`, { status });
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(prev => ({ ...prev, status }));
      toast({ title: `Status updated to ${status.toUpperCase()}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  // Open WhatsApp with pre-filled message
  const handleWhatsApp = (phone, name) => {
    if (!phone) { toast({ variant: "destructive", title: "No phone number available" }); return; }
    const clean = phone.replace(/\D/g, '');
    const num = clean.startsWith('91') ? clean : `91${clean}`;
    const msg = `Namaste ${name || 'Sir/Ma\'am'}, main Farmliv se bol raha hoon. Aapne hamare products ke liye enquiry ki thi. Kya main aapki help kar sakta hoon?`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filtered = (Array.isArray(enquiries) ? enquiries : []).filter(e => {
    if (!e) return false;
    const name = (e.customer_name || e.name || "").toLowerCase();
    const company = (e.company || "").toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || company.includes(searchTerm.toLowerCase()) || (e.phone || "").includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'new') return 'bg-blue-50 text-blue-600 border-blue-100';
    if (s === 'assigned') return 'bg-amber-50 text-amber-600 border-amber-100';
    if (s === 'contacted') return 'bg-purple-50 text-purple-600 border-purple-100';
    if (s === 'closed') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
  };

  const stats = {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'new' || e.status === 'assigned').length,
    closed: enquiries.filter(e => e.status === 'closed').length,
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Enquiry Hub</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live B2B Enquiries</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-5">
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Assigned</span>
               <span className="text-lg font-black text-slate-900 leading-none">{stats.total}</span>
            </div>
            <Target size={20} className="text-amber-500 ml-2" />
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, company, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm focus:ring-2 ring-amber-500/20 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'new', 'assigned', 'contacted', 'closed'].map(s => (
              <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filterStatus === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ENQUIRIES GRID */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="flex items-center gap-3">
               {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-amber-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            <AnimatePresence>
              {filtered.map(enq => {
                const name = enq.customer_name || enq.name || "Unknown";
                return (
                  <motion.div 
                    layout
                    key={enq.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-7 flex flex-col gap-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                  >
                    {/* TOP ROW */}
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-[1.25rem] bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors">
                             <Zap size={20} className="fill-current" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-base font-black text-slate-900 uppercase tracking-tighter italic leading-none truncate max-w-[130px]">{name}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{enq.company || "Individual"}</span>
                          </div>
                       </div>
                       <div className={`px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest ${getStatusColor(enq.status)}`}>
                          {enq.status}
                       </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col gap-2">
                       {enq.phone && (
                         <div className="flex items-center gap-2 px-3 py-1">
                            <Phone size={11} className="text-emerald-500 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-600">{enq.phone}</span>
                         </div>
                       )}
                       {enq.email && (
                         <div className="flex items-center gap-2 px-3 py-1">
                            <Mail size={11} className="text-blue-400 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-500 truncate">{enq.email}</span>
                         </div>
                       )}
                       {enq.location && (
                         <div className="flex items-center gap-2 px-3 py-1">
                            <MapPin size={11} className="text-rose-400 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-500">{enq.location}</span>
                         </div>
                       )}
                    </div>

                    {/* INQUIRY TEXT PREVIEW */}
                    {enq.notes && (
                       <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-start gap-2 border border-slate-100">
                          <FileText size={11} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-[10px] text-slate-600 italic leading-relaxed line-clamp-2">"{enq.notes}"</span>
                       </div>
                    )}

                    {/* DATE */}
                    <div className="flex items-center gap-1 text-slate-300 text-[9px] font-bold uppercase mt-auto">
                       <Calendar size={10} />
                       <span>Received: {new Date(enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                       <a href={`tel:${enq.phone}`} className="flex flex-col items-center justify-center gap-1 py-3 bg-emerald-600 text-white rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20">
                          <Phone size={14} /><span>Call</span>
                       </a>
                       <button onClick={() => handleWhatsApp(enq.phone, name)} className="flex flex-col items-center justify-center gap-1 py-3 bg-[#25D366] text-white rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-[#1ebe5d] transition-colors shadow-md shadow-green-500/20">
                          <MessageCircle size={14} /><span>WhatsApp</span>
                       </button>
                       <button onClick={() => setSelectedEnquiry(enq)} className="flex flex-col items-center justify-center gap-1 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                          <ChevronRight size={14} /><span>Details</span>
                       </button>
                    </div>

                    {/* STATUS UPDATER */}
                    <select 
                       value={enq.status} 
                       onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                       className="w-full mt-2 text-[9px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none cursor-pointer text-slate-600"
                    >
                       <option value="assigned">Phase: Assigned</option>
                       <option value="new">Phase: New</option>
                       <option value="contacted">Phase: Contacted</option>
                       <option value="closed">Result: Closed ✅</option>
                    </select>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && !loading && (
              <div className="col-span-full py-32 text-center">
                 <Zap size={48} className="mx-auto text-amber-100 mb-6 animate-pulse" />
                 <h3 className="text-xl font-black text-slate-300 uppercase tracking-[0.3em] italic">No Enquiries Found</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Adjust filters or check back later</p>
              </div>
            )}
          </div>
        )}

        {/* DETAIL MODAL */}
        <AnimatePresence>
          {selectedEnquiry && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelectedEnquiry(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 30 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-slate-900 p-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                   <button onClick={() => setSelectedEnquiry(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all z-20">
                      <X size={18} />
                   </button>
                   <div className="relative z-10">
                      <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Enquiry Details</span>
                      <h2 className="text-2xl font-black italic text-white uppercase tracking-tight mt-1">
                         {selectedEnquiry.customer_name || selectedEnquiry.name || 'Unknown'}
                      </h2>
                      <div className={`inline-flex mt-3 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusColor(selectedEnquiry.status)}`}>
                         {selectedEnquiry.status}
                      </div>
                   </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                   {[
                      { icon: Phone, label: 'Phone', value: selectedEnquiry.phone, color: 'text-emerald-500' },
                      { icon: Mail, label: 'Email', value: selectedEnquiry.email, color: 'text-blue-400' },
                      { icon: Building2, label: 'Company', value: selectedEnquiry.company, color: 'text-purple-500' },
                      { icon: MapPin, label: 'Location', value: selectedEnquiry.location, color: 'text-rose-500' },
                      { icon: Calendar, label: 'Received On', value: selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : null, color: 'text-slate-400' },
                   ].filter(r => r.value).map((row, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <row.icon size={16} className={`${row.color} shrink-0 mt-0.5`} />
                         <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{row.label}</span>
                            <span className="text-sm font-bold text-slate-800">{row.value}</span>
                         </div>
                      </div>
                   ))}

                   {selectedEnquiry.notes && (
                      <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 mt-6">
                         <div className="flex items-center gap-2 mb-3">
                            <MessageCircle size={14} className="text-amber-500" />
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Enquiry Message / Notes</span>
                         </div>
                         <p className="text-sm text-amber-800 italic leading-relaxed">"{selectedEnquiry.notes}"</p>
                      </div>
                   )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-50 grid grid-cols-2 gap-3 bg-white">
                   <a href={`tel:${selectedEnquiry.phone}`} className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                      <Phone size={16} /> Call Customer
                   </a>
                   <button onClick={() => handleWhatsApp(selectedEnquiry.phone, selectedEnquiry.customer_name || selectedEnquiry.name)} className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-green-500/20">
                      <MessageCircle size={16} /> WhatsApp
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default SalesEnquiriesPage;
