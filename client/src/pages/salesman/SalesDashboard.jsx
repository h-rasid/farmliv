import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, MapPin, Building2, Inbox, Loader2, 
  PlusCircle, TrendingUp, ChevronDown, Zap, Clock,
  MessageCircle, Phone, Mail, FileText, Info, X
} from 'lucide-react';
import SaleFormModal from './SaleFormModal'; 
import { useToast } from '@/components/ui/use-toast';
import { API_BASE } from '@/utils/config';

const SalesDashboard = () => {
  const { toast } = useToast();
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [intelLead, setIntelLead] = useState(null);

  const user = JSON.parse(localStorage.getItem('farmliv_user')); 

  useEffect(() => {
    if (user?.id) fetchAssignedLeads();
  }, [user?.id]);

  const fetchAssignedLeads = async () => {
    try {
      setLoading(true);
      const cleanId = user.id.toString().split(':')[0]; 
      const res = await axios.get(`${API_BASE}/api/leads/salesman/${cleanId}`);
      
      const activeLeads = res.data
        .filter(lead => lead.status !== 'converted')
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
      setAssignedLeads(activeLeads);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (leadId, newStatus) => {
    const updatedStatus = newStatus.toLowerCase().trim();
    setAssignedLeads(prev => 
      prev.map(lead => lead.id === leadId ? { ...lead, status: updatedStatus } : lead)
    );

    try {
      const cleanUserId = user.id.toString().split(':')[0];
      await axios.put(`${API_BASE}/api/leads/${leadId}/status`, {
        status: updatedStatus,
        changed_by: cleanUserId 
      });
      
      toast({ title: "Pipeline Synced", description: `Inquiry moved to ${newStatus.toUpperCase()}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" });
      fetchAssignedLeads(); 
    }
  };

  const openWhatsApp = (phone, name, product) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Namaste ${name}, I am ${user.name} from Farmliv. I am reaching out regarding your interest in ${product}. How can I assist you today?`;
    window.open(`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-[1600px] mx-auto p-8 space-y-16 animate-in fade-in duration-1000 font-sans">
        
        {/* --- Elite Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gray-100 pb-12">
          <div className="space-y-4">
            <h1 className="text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Sales <span className="text-emerald-600">Pipeline</span>
            </h1>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Executive Performance Node</p>
            </div>
          </div>
          <div className="bg-white px-10 py-6 rounded-portal-btn shadow-2xl border border-gray-50 flex items-center gap-6">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <TrendingUp size={24} />
             </div>
             <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active Leads</p>
                <p className="text-2xl font-black italic text-gray-900">{assignedLeads.length}</p>
             </div>
          </div>
        </div>

        {/* --- Lead Grid --- */}
        {loading ? (
          <div className="py-60 flex flex-col items-center gap-6">
            <Loader2 className="animate-spin text-emerald-600" size={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {assignedLeads.map((lead) => (
                <motion.div 
                  layout key={lead.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-[3rem] p-10 border-2 shadow-2xl group transition-all duration-700 ${
                    lead.status === 'lost' ? 'border-red-100 shadow-red-50' : 'border-gray-50 shadow-gray-50 hover:border-emerald-600/30'
                  }`}
                >
                  {/* Status Controller */}
                  <div className="mb-10 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-gray-300 uppercase mb-3 ml-4 italic tracking-widest">Lifecycle Stage</p>
                      <div className="relative">
                        <select 
                          value={lead.status || 'pending'}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className={`w-full appearance-none border-none px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer shadow-inner transition-all ${
                            lead.status === 'lost' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                        >
                          <option value="pending">⏳ Pending Review</option>
                          <option value="assigned">📍 Assigned (New)</option>
                          <option value="contacted">📞 Contacted</option>
                          <option value="quoted">📄 Quote Sent</option>
                          <option value="negotiation">🤝 Negotiation</option>
                          <option value="in process">⚙️ Processing</option>
                          <option value="lost">❌ Lead Lost</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[8px] font-black text-emerald-600 uppercase tracking-tighter">
                           <Zap size={10} fill="currentColor"/> Priority Inquiry
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 uppercase italic leading-none truncate tracking-tighter max-w-[200px]">
                          {lead.customer_name}
                        </h3>
                      </div>
                      <button 
                        onClick={() => setIntelLead(lead)}
                        className="p-4 bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all"
                      >
                        <Info size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-50 px-4 py-2 rounded-xl text-[9px] font-bold text-gray-500 flex items-center gap-2 border border-gray-100">
                        <MapPin size={12} className="text-emerald-600"/> {lead.location || 'Direct'}
                      </span>
                      <span className="bg-gray-50 px-4 py-2 rounded-xl text-[9px] font-bold text-gray-500 flex items-center gap-2 border border-gray-100">
                        <Package size={12} className="text-emerald-600"/> {lead.product_name || 'Agri Solutions'}
                      </span>
                    </div>

                    {/* Quick Communication Hub */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <button 
                        onClick={() => openWhatsApp(lead.phone, lead.customer_name, lead.product_name)}
                        className="flex items-center justify-center gap-2 py-4 bg-emerald-600/10 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <MessageCircle size={16} /> WhatsApp
                      </button>
                      <a 
                        href={`tel:${lead.phone}`}
                        className="flex items-center justify-center gap-2 py-4 bg-gray-900/5 text-gray-900 rounded-2xl hover:bg-gray-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <Phone size={16} /> Direct Call
                      </a>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => { setSelectedLead(lead); setIsSaleModalOpen(true); }} 
                    className="w-full bg-gray-900 text-white py-8 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-600 hover:-translate-y-2 transition-all duration-500 shadow-xl flex items-center justify-center gap-4"
                  >
                    <PlusCircle size={20} /> Record Final Sale
                  </button>

                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                        <Clock size={12}/> Updated {new Date(lead.updated_at).toLocaleDateString()}
                     </div>
                     <span className="text-[10px] font-black text-emerald-600 italic">#{lead.id}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* --- Lead Intel Modal --- */}
      {intelLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setIntelLead(null)}
                className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20}/>
              </button>
              
              <div className="p-12 space-y-10">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Intelligence Matrix</p>
                    <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Lead Analysis</h2>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><User size={24}/></div>
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Representative</p>
                          <p className="text-xl font-black text-gray-900 uppercase italic">{intelLead.customer_name}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Entity</p>
                          <p className="text-xs font-bold text-gray-700 truncate">{intelLead.company || 'Private Buyer'}</p>
                       </div>
                       <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Asset</p>
                          <p className="text-xs font-bold text-gray-700 truncate">{intelLead.product_name}</p>
                       </div>
                    </div>

                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={12}/> Interaction Notes</p>
                       <p className="text-sm font-medium text-gray-600 italic leading-relaxed">
                          {intelLead.notes || "No additional synchronization notes recorded for this lead node."}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <a href={`mailto:${intelLead.email}`} className="flex-1 py-6 bg-gray-900 text-white rounded-[2rem] text-center text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                       <Mail size={16}/> Send Protocol Mail
                    </a>
                 </div>
              </div>
           </motion.div>
        </div>
      )}

      {isSaleModalOpen && (
        <SaleFormModal 
          isOpen={isSaleModalOpen} 
          onClose={() => setIsSaleModalOpen(false)} 
          leadData={selectedLead}
          onSuccess={fetchAssignedLeads} 
        />
      )}
    </PortalLayout>
  );
};

export default SalesDashboard;