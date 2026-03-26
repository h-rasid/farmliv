import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';

import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Package, MoreVertical, Loader2, MessageCircle, 
  Eye, X, UserPlus, StickyNote, CheckCircle2, Clock, Send,
  Trash2, FileDown, Filter, Building2, MapPin, Mail, Phone 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import { API_BASE } from '@/utils/config';

const InquiriesManagementPage = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [staff, setStaff] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => { 
    fetchLeads();
    fetchStaff();
    markSeen();
    const interval = setInterval(() => fetchLeads(true), 5000); // 5s realtime sync (Quietly)
    return () => clearInterval(interval);
  }, []);

  const markSeen = async () => {
    try {
      await API.post('/admin/mark-seen', { type: 'leads' });
    } catch (err) {
      console.error("Mark seen error:", err);
    }
  };

  const fetchLeads = async (isQuiet = false) => {
    try {
      if (!isQuiet) setLoading(true);
      const res = await API.get('/leads');
      setLeads(res.data);
    } catch (err) {
      if (!isQuiet) toast({ variant: "destructive", title: "Sync Offline" });
      setLeads([]);
    } finally { 
      if (!isQuiet) setLoading(false); 
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await API.get('/staff');
      setStaff(res.data);
    } catch (err) {
      console.error("Staff fetch error:", err);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Farmliv - Lead Inquiry Report", 14, 15);
    const tableData = filteredLeads.map(l => [
      l.id, l.customer_name, l.company || 'N/A', l.phone, l.location || 'N/A', l.status
    ]);
    doc.autoTable({
      head: [['ID', 'Customer', 'Company', 'Phone', 'Location', 'Status']],
      body: tableData,
      startY: 20,
    });
    doc.save(`Farmliv_Leads_${new Date().toLocaleDateString()}.pdf`);
    toast({ title: "PDF Generated", description: "Inquiry report saved to downloads." });
  };

  const handleWhatsApp = (phone, name) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const message = `Namaste ${name}, Farmliv se hum aapki inquiry ke silsile mein sampark kar rahe hain.`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const assignLead = async (leadId, executiveId) => {
    try {
      await API.put(`/leads/${leadId}/assign`, { staff_id: executiveId });
      toast({ title: "Lead Assigned" });
      fetchLeads();
    } catch (err) { toast({ variant: "destructive", title: "Assignment Failed" }); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/leads/${id}/status`, { status: newStatus });
      toast({ title: "Status Updated" });
      fetchLeads();
    } catch (err) { toast({ variant: "destructive", title: "Update Error" }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this inquiry permanently?")) return;
    try {
      await API.delete(`/leads/${id}`);
      setLeads(prevLeads => prevLeads.filter(l => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
      toast({ title: "Inquiry Purged" });
    } catch (err) { toast({ variant: "destructive", title: "Action Failed" }); }
  };

  const saveNote = async () => {
    if (!noteText) return;
    try {
      await API.put(`/leads/${selectedLead.id}/notes`, { notes: noteText });
      toast({ title: "Note Saved" });
      setNoteText('');
      fetchLeads();
      setSelectedLead({...selectedLead, notes: noteText});
    } catch (err) { toast({ variant: "destructive", title: "Note Failed" }); }
  };

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'converted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'lost': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'in process': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="max-w-[1600px] mx-auto p-10 space-y-10 font-sans text-slate-900">
        
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight italic">Lead Inquiries</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">Manage Customer Inquiries</p>
          </div>
          
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <div className="relative">
              <select 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-bold uppercase outline-none cursor-pointer"
              >
                <option value="All">All Inquiries</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Process">In Process</option>
                <option value="Converted">Converted</option>
              </select>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search by name or company..." 
                className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-50"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button onClick={exportToPDF} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <FileDown size={18}/> Export PDF
            </button>
          </div>
        </header>

        {loading ? (
          <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <motion.div layout key={lead.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-8 group hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-6 min-w-[300px]">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><User size={20}/></div>
                  <div>
                    <h3 className="text-sm font-bold uppercase text-gray-900">{lead.customer_name}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                       <span className="text-[10px] text-slate-700 font-black uppercase flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><Phone size={10} className="text-[#2E7D32]"/> {lead.phone}</span>
                       <span className="text-[10px] text-slate-400 font-black uppercase flex items-center gap-1.5"><Building2 size={12}/> {lead.company || 'Individual'}</span>
                       <span className="text-[10px] text-slate-400 font-black uppercase flex items-center gap-1.5"><MapPin size={12}/> {lead.location || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Inquiry Request</p>
                  <p className="text-xs font-bold uppercase text-slate-700">{lead.product_name || 'General Query'}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="min-w-[140px] flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(lead.status)}`}>
                      ● {lead.status}
                    </span>
                    {(lead.status?.toLowerCase() === 'new' || lead.status?.toLowerCase() === 'pending') && (
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50" title="Unprocessed Inquiry" />
                    )}
                  </div>

                  <select 
                    onChange={(e) => assignLead(lead.id, e.target.value)}
                    className="text-[10px] font-black uppercase p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={lead.assigned_to || ""}
                  >
                    <option value="" disabled>Assign Salesman</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>

                  <div className="flex items-center gap-2 border-l pl-4 border-slate-100">
                    <button onClick={() => setSelectedLead(lead)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Eye size={16}/></button>
                    <button onClick={() => handleWhatsApp(lead.phone, lead.customer_name)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><MessageCircle size={16}/></button>
                    <button onClick={() => handleDelete(lead.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16}/></button>

                    <div className="relative group/status">
                      <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all"><MoreVertical size={16}/></button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-30 overflow-hidden">
                        {['New', 'Contacted', 'In Process', 'Converted', 'Lost'].map(s => (
                          <button key={s} onClick={() => updateStatus(lead.id, s)} className="w-full text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 border-b border-slate-50 last:border-0">{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* INQUIRY DETAIL MODAL */}
        <AnimatePresence>
          {selectedLead && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-y-auto max-h-[90vh]">
                <div className="p-6 bg-slate-50 border-b flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   Lead Details <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-slate-200 rounded-full transition-all"><X size={20}/></button>
                </div>

                <div className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Customer Entity</p>
                        <p className="text-sm font-bold uppercase mt-1">{selectedLead.customer_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-2"><Phone size={14} className="text-[#2E7D32]"/> {selectedLead.phone}</p>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-2"><Mail size={14} className="text-[#2E7D32]"/> {selectedLead.email || 'No Email'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                         <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Company Detail</p>
                        <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-2"><Building2 size={14}/> {selectedLead.company || 'Not Specified'}</p>
                      </div>
                      <div>
                         <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Location</p>
                        <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-2"><MapPin size={14}/> {selectedLead.location || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  {/* ⭐ Added: Order Specification (Product & Quantity) */}
                  <div className="grid grid-cols-2 gap-8 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div>
                      <p className="text-[9px] uppercase font-black text-emerald-600 tracking-widest">Product Requested</p>
                      <p className="text-xs font-bold text-slate-900 mt-1 uppercase">{selectedLead.product_name || 'General Inquiry'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-black text-emerald-600 tracking-widest">Order Volume</p>
                      <p className="text-xs font-bold text-slate-900 mt-1 uppercase">{selectedLead.quantity || '0'} Units</p>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                     <div className="flex items-center gap-2 text-slate-400"><StickyNote size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Inquiry Notes</span></div>
                    <textarea
                      placeholder="Add technical notes..."
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-50 h-24 resize-none"
                      defaultValue={selectedLead.notes}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <button onClick={saveNote} className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                      <Send size={14}/> Sync Progress Note
                    </button>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => updateStatus(selectedLead.id, 'Converted')} className="flex-1 bg-emerald-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"><CheckCircle2 size={16}/> Mark as Converted</button>
                    <button onClick={() => handleDelete(selectedLead.id)} className="flex-1 bg-rose-50 text-rose-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"><Trash2 size={16}/> Purge Inquiry</button>
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

export default InquiriesManagementPage;

