import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Phone, Mail, MapPin,
  CheckCircle2, Clock, Filter, Target, Users, Zap,
  TrendingUp, MessageCircle, X, Package, FileText,
  Calendar, Building2, ChevronRight, Star
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const { toast } = useToast();

  const fetchLeads = useCallback(async (isQuiet = false) => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await API.get(`salesman/${user.id}/leads`);
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lead Sync Failed:", err.message);
    } finally {
      if (!isQuiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    const iv = setInterval(() => fetchLeads(true), 10000);
    return () => clearInterval(iv);
  }, [fetchLeads]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`leads/${id}/status`, { status });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      if (selectedLead?.id === id) setSelectedLead(prev => ({ ...prev, status }));
      toast({ title: `Status updated to ${status.toUpperCase()}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  // Open WhatsApp with pre-filled message
  const handleWhatsApp = (phone, name, product) => {
    if (!phone) { toast({ variant: "destructive", title: "No phone number available" }); return; }
    const clean = phone.replace(/\D/g, '');
    const num = clean.startsWith('91') ? clean : `91${clean}`;
    const msg = `Namaste ${name || 'Sir/Ma\'am'}, main Farmliv se bol raha hoon. Aapne ${product || 'hamare product'} ke baare mein enquiry ki thi. Kya main aapki help kar sakta hoon?`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filtered = (Array.isArray(leads) ? leads : []).filter(l => {
    if (!l) return false;
    const name = (l.customer_name || l.name || "").toLowerCase();
    const product = (l.product_name || l.product_interest || "").toLowerCase();
    const company = (l.company || "").toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                          product.includes(searchTerm.toLowerCase()) ||
                          company.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'follow-up': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'assigned': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'negotiation': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'converted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'lost': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new' || l.status === 'assigned').length,
    converted: leads.filter(l => l.status === 'converted').length,
    pending: leads.filter(l => ['contacted', 'follow-up', 'negotiation'].includes(l.status)).length
  };

  return (
    <>
      <div className="flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Lead Hub</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Lead Synchronization</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 px-5">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Conversion Rate</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-slate-900 leading-none">
                  {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%
                </span>
                <TrendingUp size={12} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', val: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'New / Assigned', val: stats.new, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'In Pipeline', val: stats.pending, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Converted', val: stats.converted, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}><s.icon size={18} /></div>
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
              placeholder="Search by name, company, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'new', 'assigned', 'contacted', 'follow-up', 'negotiation', 'converted', 'lost'].map(s => (
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

        {/* LEADS GRID */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="flex items-center gap-3">
              {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
            <AnimatePresence>
              {filtered.map(lead => {
                const name = lead.customer_name || lead.name || 'Unknown';
                const product = lead.product_name || lead.product_interest || '';
                return (
                  <motion.div
                    layout
                    key={lead.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-7 flex flex-col gap-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                  >
                    {/* TOP ROW */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <Target size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black text-slate-900 uppercase tracking-tighter italic leading-none truncate max-w-[130px]">{name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{lead.company || 'Individual'}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-dashed ${getStatusStyle(lead.status)}`}>
                        {lead.status}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col gap-2">
                      {product && (
                        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                          <Package size={12} className="text-blue-500 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-700 truncate">{product}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2 px-3 py-1">
                          <Phone size={11} className="text-emerald-500 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-600">{lead.phone}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-2 px-3 py-1">
                          <Mail size={11} className="text-blue-400 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-500 truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.location && (
                        <div className="flex items-center gap-2 px-3 py-1">
                          <MapPin size={11} className="text-rose-400 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-500">{lead.location}</span>
                        </div>
                      )}
                      {lead.quantity && (
                        <div className="flex items-center gap-2 px-3 py-1">
                          <Star size={11} className="text-amber-400 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-500">Qty: {lead.quantity}</span>
                        </div>
                      )}
                    </div>

                    {/* NOTES PREVIEW */}
                    {lead.notes && (
                      <div className="bg-amber-50 rounded-xl px-3 py-2 flex items-start gap-2">
                        <FileText size={11} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-[10px] text-amber-700 italic leading-relaxed line-clamp-2">{lead.notes}</span>
                      </div>
                    )}

                    {/* DATE */}
                    <div className="flex items-center gap-1 text-slate-300 text-[9px] font-bold uppercase">
                      <Calendar size={10} />
                      <span>Received: {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Call */}
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex flex-col items-center justify-center gap-1 py-3 bg-emerald-600 text-white rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                      >
                        <Phone size={14} />
                        <span>Call</span>
                      </a>

                      {/* WhatsApp */}
                      <button
                        onClick={() => handleWhatsApp(lead.phone, name, product)}
                        className="flex flex-col items-center justify-center gap-1 py-3 bg-[#25D366] text-white rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-[#1ebe5d] transition-colors shadow-md shadow-green-500/20"
                      >
                        <MessageCircle size={14} />
                        <span>WhatsApp</span>
                      </button>

                      {/* View Full Details */}
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="flex flex-col items-center justify-center gap-1 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                      >
                        <ChevronRight size={14} />
                        <span>Details</span>
                      </button>
                    </div>

                    {/* STATUS UPDATER */}
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      className="w-full text-[9px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none cursor-pointer text-slate-600"
                    >
                      <option value="assigned">Phase: Assigned</option>
                      <option value="new">Phase: New</option>
                      <option value="contacted">Phase: Contacted</option>
                      <option value="follow-up">Phase: Follow-up</option>
                      <option value="negotiation">Phase: Negotiate</option>
                      <option value="converted">Result: Converted ✅</option>
                      <option value="lost">Result: Lost ❌</option>
                    </select>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && !loading && (
              <div className="col-span-full py-32 text-center">
                <Target size={48} className="mx-auto text-slate-100 mb-6 animate-bounce" />
                <h3 className="text-xl font-black text-slate-300 uppercase tracking-[0.3em] italic">No leads found</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Adjust filters or wait for admin to assign new leads</p>
              </div>
            )}
          </div>
        )}

        {/* DETAIL MODAL */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-slate-900 p-8 relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  <button onClick={() => setSelectedLead(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
                    <X size={18} />
                  </button>
                  <div className="relative z-10">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Lead Details</span>
                    <h2 className="text-2xl font-black italic text-white uppercase tracking-tight mt-1">
                      {selectedLead.customer_name || selectedLead.name || 'Unknown'}
                    </h2>
                    <div className={`inline-flex mt-3 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(selectedLead.status)}`}>
                      {selectedLead.status}
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                  {[
                    { icon: Package, label: 'Product', value: selectedLead.product_name || selectedLead.product_interest, color: 'text-blue-500' },
                    { icon: Phone, label: 'Phone', value: selectedLead.phone, color: 'text-emerald-500' },
                    { icon: Mail, label: 'Email', value: selectedLead.email, color: 'text-blue-400' },
                    { icon: Building2, label: 'Company', value: selectedLead.company, color: 'text-purple-500' },
                    { icon: MapPin, label: 'Location', value: selectedLead.location, color: 'text-rose-500' },
                    { icon: Star, label: 'Quantity', value: selectedLead.quantity, color: 'text-amber-500' },
                    { icon: Calendar, label: 'Received On', value: selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : null, color: 'text-slate-400' },
                  ].filter(r => r.value).map((row, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                      <row.icon size={16} className={`${row.color} shrink-0 mt-0.5`} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{row.label}</span>
                        <span className="text-sm font-bold text-slate-800">{row.value}</span>
                      </div>
                    </div>
                  ))}

                  {selectedLead.notes && (
                    <div className="p-4 bg-amber-50 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-amber-500" />
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Admin Notes</span>
                      </div>
                      <p className="text-sm text-amber-800 italic leading-relaxed">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer - Action Buttons */}
                <div className="p-6 border-t border-slate-50 grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    <Phone size={16} /> Call Customer
                  </a>
                  <button
                    onClick={() => handleWhatsApp(selectedLead.phone, selectedLead.customer_name || selectedLead.name, selectedLead.product_name || selectedLead.product_interest)}
                    className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-green-500/20"
                  >
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

export default SalesLeadsPage;
