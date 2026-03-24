import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';

import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Shield, Trash2, Search, Loader2, Key, 
  Phone, Mail, Fingerprint, Activity, CheckCircle2, X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StaffManagementPage = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('directory'); // directory | logs

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'salesman', phone: ''
  });


  useEffect(() => { 
    fetchStaff();
    fetchLogs();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await API.get('/staff');
      setStaff(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" });
      // Demo fallback
      setStaff([]);
    } finally { setLoading(false); }
  };

  const fetchLogs = async () => {
    try {
      const res = await API.get('/admin/activities');
      setLogs(res.data);
    } catch (err) { console.log("Logs offline"); }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/staff', formData);
      toast({ title: "Staff Sync Complete", description: `${formData.name} added as ${formData.role}` });
      setFormData({ name: '', email: '', password: '', role: 'salesman', phone: '' });
      fetchStaff();
    } catch (err) { toast({ variant: "destructive", title: "Onboarding Failed" }); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Purge ${name} from Farmliv Team?`)) return;
    try {
      await API.delete(`/staff/${id}`);
      toast({ title: "Staff Purged" });
      fetchStaff();
    } catch (err) { toast({ variant: "destructive", title: "Purge Failed" }); }
  };

  // ⭐ ROLE PERMISSIONS LOGIC
  const getRolePermissions = (role) => {
    if (role === 'admin') return ["Full System Access", "Financial Control", "HR Oversight"];
    return ["Lead Management", "Product View Only", "Order Status Update"];
  };

  return (
    <>
      <div className="max-w-[1600px] mx-auto p-10 space-y-12 font-sans text-slate-900">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight uppercase">Staff Directory</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">Manage Team & Activity</p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => setView('directory')} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${view === 'directory' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Staff Directory</button>
            <button onClick={() => setView('logs')} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${view === 'logs' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}>Activity Logs</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* ⭐ RECRUITMENT NODE (Add Admin/Sales Executive) */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-32 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold uppercase flex items-center gap-3"><UserPlus className="text-emerald-600" size={20}/> Onboard Staff</h3>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Add new staff credentials</p>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-5">
                <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none" />
                <input required type="email" placeholder="Corporate Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none" />
                <input required type="password" placeholder="Access Protocol (Pass)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none" />
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase text-slate-400 ml-2">Clearance Level</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none">
                    <option value="salesman">Sales Executive</option>
                    <option value="admin">Regional Admin</option>
                  </select>
                </div>
                <button disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Add Staff Member"}
                </button>
              </form>
            </motion.div>
          </div>

          {/* ⭐ MAIN VIEW ENGINE (Directory or Logs) */}
          <div className="lg:col-span-2">
            {view === 'directory' ? (
              <div className="space-y-6">
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="text" placeholder="Search staff directory..." className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-xs font-medium outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {staff.map((member) => (
                    <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold uppercase">{member.name.charAt(0)}</div>
                        <div>
                          <h4 className="text-sm font-semibold uppercase">{member.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{member.email}</p>
                          {/* ⭐ Role Permissions Preview */}
                          <div className="flex gap-1 mt-2">
                            {getRolePermissions(member.role).map(p => (
                              <span key={p} className="px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-md text-[8px] font-bold uppercase">{p}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${member.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{member.role}</span>
                        <button onClick={() => handleDelete(member.id, member.name)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ⭐ ACTIVITY LOGS VIEW */
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-semibold uppercase flex items-center gap-3 text-slate-600"><Activity size={18}/> Real-time Action Stream</h3>
                </div>
                <div className="p-4 space-y-2">
                  {logs.length > 0 ? logs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 hover:bg-slate-50 rounded-2xl transition-all border-b border-slate-50 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-700">{log.action}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">{log.user} • {log.time}</p>
                      </div>
                      <Fingerprint size={16} className="text-slate-200" />
                    </div>
                  )) : (
                    <div className="py-20 text-center text-slate-300 uppercase text-[10px] font-bold tracking-[0.2em]">No activities recorded in the portal</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default StaffManagementPage;
