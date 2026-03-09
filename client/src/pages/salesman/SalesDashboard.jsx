import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, MapPin, Building2, Inbox, Loader2, 
  PlusCircle, TrendingUp, ChevronDown, Zap, Clock 
} from 'lucide-react';
import SaleFormModal from './SaleFormModal'; 
import { useToast } from '@/components/ui/use-toast';

const SalesDashboard = () => {
  const { toast } = useToast();
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const user = JSON.parse(localStorage.getItem('farmliv_user')); 

  useEffect(() => {
    if (user?.id) fetchAssignedLeads();
  }, [user?.id]);

  const fetchAssignedLeads = async () => {
    try {
      setLoading(true);
      const cleanId = user.id.toString().split(':')[0]; 
      const res = await axios.get(`http://localhost:5000/api/leads/salesman/${cleanId}`);
      
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
    setAssignedLeads(prev => 
      prev.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead)
    );

    try {
      const cleanUserId = user.id.toString().split(':')[0];
      await axios.put(`http://localhost:5000/api/leads/${leadId}`, {
        assigned_to: cleanUserId,
        status: newStatus.toLowerCase().trim(),
        changed_by: cleanUserId 
      });
      
      toast({ title: "Pipeline Synced", description: `Inquiry moved to ${newStatus.toUpperCase()}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" });
      fetchAssignedLeads(); 
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-[1600px] mx-auto p-8 space-y-16 animate-in fade-in duration-1000 font-sans">
        
        {/* --- Elite Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gray-100 pb-12">
          <div className="space-y-4">
            <h1 className="text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Sales <span className="text-farmliv-green">Pipeline</span>
            </h1>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-farmliv-green animate-pulse" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Executive Performance Node</p>
            </div>
          </div>
          <div className="bg-white px-10 py-6 rounded-portal-btn shadow-2xl border border-gray-50 flex items-center gap-6">
             <div className="w-12 h-12 bg-farmliv-light rounded-2xl flex items-center justify-center text-farmliv-green">
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
            <Loader2 className="animate-spin text-farmliv-green" size={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {assignedLeads.map((lead) => (
                <motion.div 
                  layout key={lead.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-portal-card p-10 border-2 shadow-2xl group transition-all duration-700 ${
                    lead.status === 'lost' ? 'border-red-100 shadow-red-50' : 'border-gray-50 shadow-gray-50 hover:border-farmliv-green/30'
                  }`}
                >
                  {/* Status Controller */}
                  <div className="mb-10">
                    <p className="text-[9px] font-black text-gray-300 uppercase mb-3 ml-4 italic tracking-widest">Lifecycle Stage</p>
                    <div className="relative">
                      <select 
                        value={lead.status || 'pending'}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`w-full appearance-none border-none px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer shadow-inner transition-all ${
                          lead.status === 'lost' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-700 hover:bg-farmliv-light hover:text-farmliv-green'
                        }`}
                      >
                        <option value="pending">⏳ Pending Review</option>
                        <option value="assigned">📍 Assigned (New)</option>
                        <option value="accept">✅ Quote Accepted</option>
                        <option value="process">⚙️ Processing</option>
                        <option value="progress">🚧 In Progress</option>
                        <option value="lost">❌ Lead Lost</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[8px] font-black text-farmliv-green uppercase tracking-tighter">
                         <Zap size={10} fill="currentColor"/> Priority Inquiry
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 uppercase italic leading-none truncate tracking-tighter">
                        {lead.customer_name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className="bg-gray-50 px-4 py-2 rounded-xl text-[9px] font-bold text-gray-500 flex items-center gap-2 border border-gray-100">
                        <MapPin size={12} className="text-farmliv-green"/> {lead.details?.location || 'Direct'}
                      </span>
                      <span className="bg-gray-50 px-4 py-2 rounded-xl text-[9px] font-bold text-gray-500 flex items-center gap-2 border border-gray-100">
                        <Package size={12} className="text-farmliv-green"/> {lead.product_name}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => { setSelectedLead(lead); setIsSaleModalOpen(true); }} 
                    className="w-full bg-gray-900 text-white py-8 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-farmliv-green hover:-translate-y-2 transition-all duration-500 shadow-xl flex items-center justify-center gap-4"
                  >
                    <PlusCircle size={20} /> Record Final Sale
                  </button>

                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                        <Clock size={12}/> Updated {new Date(lead.updated_at).toLocaleDateString()}
                     </div>
                     <span className="text-[10px] font-black text-farmliv-green italic">#{lead.id}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

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