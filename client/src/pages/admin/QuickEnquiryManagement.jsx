import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Building2, Trash2, 
  MessageSquare, Loader2, UserPlus, X, Eye 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuickEnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null); // ⭐ Added for detail view
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    markSeen();
    const interval = setInterval(() => fetchData(true), 5000); // Red dot sync polling (Quietly)
    return () => clearInterval(interval);
  }, []);

  const markSeen = async () => {
    try {
      await API.post('/admin/mark-seen', { type: 'enquiries' });
    } catch (err) {
      console.error("Mark seen error:", err);
    }
  };

  const fetchData = async (isQuiet = false) => {
    try {
      if (!isQuiet) setLoading(true);
      const [enqRes, staffRes] = await Promise.all([
        API.get('/quick-enquiries'),
        API.get('/staff')
      ]);
      setEnquiries(enqRes.data);
      setStaff(staffRes.data);
    } catch (err) {
      if (!isQuiet) toast({ variant: "destructive", title: "Sync Error" });
    } finally {
      if (!isQuiet) setLoading(false);
    }
  };

  const handleAssign = async (id, staffId) => {
    try {
      await API.put(`/quick-enquiries/${id}/assign`, { staff_id: staffId });
      toast({ title: "Salesman Assigned" });
      fetchData();
    } catch (err) { toast({ variant: "destructive", title: "Assignment Failed" }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this enquiry?")) return;
    try {
      await API.delete(`/quick-enquiries/${id}`);
      setEnquiries(enquiries.filter(e => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      toast({ title: "Enquiry Purged" });
    } catch (err) { toast({ variant: "destructive", title: "Error" }); }
  };

  const getStatusStyle = (status) => {
    return status === 'Pending' 
      ? 'bg-amber-50 text-amber-600 border-amber-100' 
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  return (
    <>
      <div className="max-w-[1450px] mx-auto p-10 space-y-8 font-sans">
        <header className="border-b border-gray-100 pb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Inquiry Hub</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Admin Portal Sync</p>
        </header>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#2E7D32]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {enquiries.map((enquiry) => (
              <motion.div key={enquiry.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center group hover:shadow-xl hover:border-emerald-100 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-all"><MessageSquare size={24}/></div>
                  <div>
                    <h3 className="font-black uppercase text-gray-900 tracking-tighter">{enquiry.customer_name}</h3>
                    <div className="flex gap-4 mt-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Building2 size={12}/> {enquiry.company || 'Individual'}</span>
                      <span className="flex items-center gap-1"><MapPin size={12}/> {enquiry.location || 'Assam'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-6 lg:mt-0">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(enquiry.status)}`}>
                      ● {enquiry.status}
                    </span>
                    {enquiry.status === 'Pending' && (
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50" />
                    )}
                  </div>

                  <select 
                    onChange={(e) => handleAssign(enquiry.id, e.target.value)}
                    className="text-[10px] font-black uppercase tracking-widest p-3 bg-gray-50 border-none rounded-xl outline-none min-w-[160px]"
                    value={enquiry.assigned_to || ""}
                  >
                    <option value="" disabled>Assign Salesman</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>

                  <div className="flex items-center gap-2 border-l pl-4 border-gray-100">
                    <button onClick={() => setSelectedEnquiry(enquiry)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Eye size={18}/></button>
                    <a href={`tel:${enquiry.phone}`} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Phone size={18}/></a>
                    <button onClick={() => handleDelete(enquiry.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* QUICK ENQUIRY DETAIL MODAL */}
        <AnimatePresence>
          {selectedEnquiry && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" onClick={() => setSelectedEnquiry(null)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Enquiry Dossier</h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inquiry ID: #{selectedEnquiry.id}</p>
                  </div>
                  <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
                </div>
                
                <div className="p-10 space-y-10">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Customer Identity</p>
                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{selectedEnquiry.customer_name}</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Phone size={14}/></div>
                          <p className="text-xs font-bold">{selectedEnquiry.phone}</p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Mail size={14}/></div>
                          <p className="text-xs font-bold lowercase">{selectedEnquiry.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Admin Portal</p>
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Building2 size={14}/></div>
                          <p className="text-xs font-bold uppercase">{selectedEnquiry.company || 'Not Specified'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Geographic Axis</p>
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><MapPin size={14}/></div>
                          <p className="text-xs font-bold uppercase">{selectedEnquiry.location || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <MessageSquare size={18}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Requirement Protocols</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 min-h-[120px]">
                      <p className="text-xs font-medium text-slate-700 leading-relaxed italic">
                        "{selectedEnquiry.notes || 'No operational requirements provided.'}"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a 
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-green-900/10"
                    >
                      Establish WhatsApp
                    </a>
                    <button 
                      onClick={() => { handleDelete(selectedEnquiry.id); }} 
                      className="flex-1 bg-rose-50 text-rose-500 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      Purge Memory
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default QuickEnquiryManagement;