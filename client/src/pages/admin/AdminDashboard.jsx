import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Package, IndianRupee, Database, 
  Truck, AlertCircle, TrendingUp, History, 
  Plus, Trash2, Globe, Activity, Layers, BarChart3,
  Bell, X, MessageSquare, Phone, Building2, MapPin, Mail, ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ 
    revenue: 0, leads: 0, lowStock: 0, products: 0, 
    productList: [] 
  });
  const [activities, setActivities] = useState([]);
  const [liveLeads, setLiveLeads] = useState([]);
  const [staff, setStaff] = useState([]); 
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const [highlightedLeadId, setHighlightedLeadId] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // WhatsApp Config
  const DEFAULT_ADMIN_WHATSAPP = "919181395595"; 

  const handleNotifClick = (leadId) => {
    const readNotifs = JSON.parse(localStorage.getItem('readNotifs') || '[]');
    if (!readNotifs.includes(leadId)) {
      readNotifs.push(leadId);
      localStorage.setItem('readNotifs', JSON.stringify(readNotifs));
    }

    setNotifications(prev => prev.filter(n => n.id !== leadId));
    setShowNotifPanel(false);
    setHighlightedLeadId(leadId);
    setActiveTab('leads');
    setTimeout(() => setHighlightedLeadId(null), 6000);

    toast({ 
      title: "Lead Located", 
      description: `Viewing synchronized data for Inquiry Node #${leadId}` 
    });
  };

  const salesData = [
    { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 }, { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 }, { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  useEffect(() => {
    const syncNodeData = () => {
      fetchGlobalData();
      fetchLiveLeads();
      fetchStaff();
    };
    syncNodeData();
    const interval = setInterval(syncNodeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchGlobalData = async () => {
    try {
      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data);
      setActivities([
        { id: 1, action: "New Lead Synchronized", user: "System", time: "Just Now" },
        { id: 2, action: "Stock Threshold Alert", user: "Inventory", time: "2h ago" }
      ]);
    } catch (err) {
      console.error("Node Sync Error:", err.message);
    }
  };

  const fetchLiveLeads = async () => {
    try {
      const res = await API.get('/leads');
      setLiveLeads(res.data);

      const readNotifs = JSON.parse(localStorage.getItem('readNotifs') || '[]');
      const pendingLeads = res.data.filter(l => l.status === 'Pending' && !readNotifs.includes(l.id));
      
      const newNotifs = pendingLeads
        .slice(0, 5)
        .map(l => ({
          id: l.id,
          title: 'New B2B Enquiry',
          desc: `${l.customer_name} from ${l.company || 'Individual'} has submitted an enquiry.`,
          time: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      setNotifications(newNotifs);

    } catch (err) {
      console.error("Pipeline Sync Error:", err);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await API.get('/staff');
      setStaff(res.data);
    } catch (err) {
      console.error("Staff Node Offline");
    }
  };

  const handleAssign = async (id, staffId) => {
    try {
      await API.put(`/leads/${id}/assign`, { staff_id: staffId });
      toast({ title: "Salesman Assigned", description: "Notification email dispatched to staff node." });
      fetchLiveLeads();
    } catch (err) {
      toast({ variant: "destructive", title: "Assignment Failed" });
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Purge this inquiry node permanently?")) return;
    try {
      await API.delete(`/leads/${id}`);
      toast({ title: "Lead Purged" });
      setLiveLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
      <div className={`p-2.5 w-fit rounded-xl ${colorClass} mb-4`}><Icon size={18} /></div>
      <div>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">
          {title.includes('Revenue') && '₹'}{value}
        </h2>
      </div>
    </motion.div>
  );

  return (
    <PortalLayout role="admin">
      <div className="max-w-[1450px] mx-auto p-6 md:p-10 space-y-8 font-sans text-slate-900 min-h-screen flex flex-col">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 italic">Enterprise Console</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">B2B Agri Node Management Active</p>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <nav className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {['overview', 'products', 'leads'].map((id) => (
                <button key={id} onClick={() => setActiveTab(id)} 
                  className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {id}
                </button>
              ))}
            </nav>

            <div className="relative">
              <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className={`p-2.5 rounded-xl transition-all border shadow-sm relative group ${notifications.length > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
              >
                <Bell size={20} className={notifications.length > 0 ? 'animate-bounce' : ''} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-4 w-80 bg-white shadow-2xl rounded-[2rem] border border-slate-100 overflow-hidden z-50">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Intelligence Alerts</h4>
                      <button onClick={() => setShowNotifPanel(false)} className="text-slate-400 hover:text-slate-900"><X size={16}/></button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotifClick(n.id)}
                            className="p-5 border-b border-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer group relative overflow-hidden"
                          >
                            <div className="flex gap-4">
                               <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg h-fit"><MessageSquare size={14}/></div>
                               <div>
                                  <p className="text-xs font-bold text-slate-900 mb-1 group-hover:text-emerald-700">{n.title}</p>
                                  <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{n.desc}</p>
                                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">{n.time}</span>
                               </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center">
                            <Activity size={30} className="mx-auto text-slate-200 mb-2" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Unread Alerts</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* ⭐ Header logout button has been removed */}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Products" value={stats.products} icon={Database} colorClass="bg-blue-50 text-blue-600" />
                <StatCard title="Total Inquiries" value={stats.leads} icon={Users} colorClass="bg-purple-50 text-purple-600" />
                <StatCard title="Total Revenue" value={stats.revenue} icon={IndianRupee} colorClass="bg-emerald-50 text-emerald-600" />
                <StatCard title="Low Stock" value={stats.lowStock} icon={AlertCircle} colorClass="bg-rose-50 text-rose-600" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div><h3 className="text-sm font-semibold text-slate-800">Sales Performance</h3><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Revenue Flow Analysis</p></div>
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 w-full min-h-[350px]">
                    <ResponsiveContainer width="99%" height="100%">
                      <AreaChart data={salesData}>
                        <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} /><Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} /><Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col min-h-[400px]">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest"><History size={16} /> Recent Activity Logs</div>
                  <div className="space-y-6 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
                    {activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <div className="flex flex-col"><p className="text-xs font-bold text-slate-800 leading-tight">{act.action}</p><p className="text-[9px] text-slate-400 mt-1 uppercase font-black tracking-tighter">{act.user} • {act.time}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-8"><h3 className="text-sm font-bold uppercase tracking-tight text-slate-800 italic">Inventory Asset Matrix</h3><button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-green-900/10"><Plus size={14} /> Full Inventory Node</button></div>
              <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest"><th className="py-4 px-2">Asset Identity</th><th className="py-4 px-2">Category Node</th><th className="py-4 px-2">Stock Threshold</th><th className="py-4 px-2 text-right">Unit Price</th></tr></thead><tbody className="divide-y divide-slate-50">{stats.productList?.map((prod) => (<tr key={prod.id} className="group hover:bg-slate-50 transition-colors text-xs"><td className="py-4 px-2 font-bold text-slate-800 uppercase tracking-tighter">{prod.name}</td><td className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase">{prod.category}</td><td className="py-4 px-2"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${prod.stock <= 10 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{prod.stock} Units</span></td><td className="py-4 px-2 text-right font-bold text-slate-900 tracking-tight">₹{prod.price}</td></tr>))}</tbody></table></div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-800 italic">Live Pipeline Synchronization</h3>
                <button onClick={() => navigate('/admin/leads')} className="text-emerald-600 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform">Inquiry Hub <ExternalLink size={12}/></button>
              </div>
              <div className="space-y-4">
                {liveLeads.map((lead) => (
                  <motion.div 
                    key={lead.id} 
                    animate={highlightedLeadId === lead.id ? { scale: 1.02, borderColor: '#10b981' } : { scale: 1, borderColor: '#f1f5f9' }}
                    className={`flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-white border rounded-[2.5rem] transition-all duration-500 ${highlightedLeadId === lead.id ? 'ring-2 ring-emerald-400 ring-offset-2 shadow-2xl z-10' : 'hover:shadow-lg hover:border-emerald-100'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <Users size={20}/>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                          Lead Node #{lead.id} {highlightedLeadId === lead.id && <span className="text-emerald-600 animate-pulse">● New Acquisition</span>}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">{lead.customer_name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Building2 size={12}/> {lead.company || 'Individual'}</span>
                          <span className="flex items-center gap-1"><MapPin size={12}/> {lead.location || 'Assam'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6 lg:mt-0 w-full lg:w-auto">
                      <div className="flex items-center gap-2 mr-4 border-r pr-4 border-slate-100 h-10">
                         <a href={`https://wa.me/${lead.phone ? lead.phone.replace(/\D/g, '') : ""}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm"><MessageSquare size={16} /></a>
                         <a href={`tel:${lead.phone}`} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Phone size={16} /></a>
                      </div>

                      <select onChange={(e) => handleAssign(lead.id, e.target.value)} className="text-[10px] font-black uppercase tracking-widest p-3 bg-slate-50 border-none rounded-xl outline-none min-w-[160px]" value={lead.assigned_to || ""}>
                        <option value="" disabled>Assign Node</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      
                      <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${lead.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>● {lead.status}</span>
                      <button onClick={() => handleDeleteLead(lead.id)} className="p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* ⭐ Terminate Admin Session button has been removed */}
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;