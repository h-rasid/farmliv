import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Building2, Trash2, 
  MessageSquare, Loader2, UserPlus 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuickEnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enqRes, staffRes] = await Promise.all([
        API.get('/quick-enquiries'),
        API.get('/staff')
      ]);
      setEnquiries(enqRes.data);
      setStaff(staffRes.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" });
    } finally { setLoading(false); }
  };

  const handleAssign = async (id, staffId) => {
    try {
      await API.put(`/quick-enquiries/${id}/assign`, { staff_id: staffId });
      toast({ title: "Sales Node Assigned" });
      fetchData();
    } catch (err) { toast({ variant: "destructive", title: "Assignment Failed" }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this enquiry node?")) return;
    try {
      await API.delete(`/quick-enquiries/${id}`);
      setEnquiries(enquiries.filter(e => e.id !== id));
      toast({ title: "Enquiry Purged" });
    } catch (err) { toast({ variant: "destructive", title: "Error" }); }
  };

  return (
    <PortalLayout role="admin">
      <div className="p-10 space-y-8">
        <header>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Inquiry Hub</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Industrial Popup Leads Synchronization</p>
        </header>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#2E7D32]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {enquiries.map((enquiry) => (
              <motion.div key={enquiry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center group hover:shadow-xl transition-all">
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
                  <select 
                    onChange={(e) => handleAssign(enquiry.id, e.target.value)}
                    className="text-[10px] font-black uppercase p-3 bg-gray-50 border-none rounded-xl outline-none"
                    value={enquiry.assigned_to || ""}
                  >
                    <option value="" disabled>Assign Salesman</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>

                  <div className="flex items-center gap-2 border-l pl-4 border-gray-100">
                    <a href={`tel:${enquiry.phone}`} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-[#2E7D32] hover:text-white transition-all"><Phone size={16}/></a>
                    <button onClick={() => handleDelete(enquiry.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default QuickEnquiryManagement;