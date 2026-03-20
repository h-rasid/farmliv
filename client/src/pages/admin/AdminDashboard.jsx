import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, Database, ShoppingBag, Target, PieChart,
  Truck, AlertCircle, TrendingUp, History, 
  Plus, Trash2, Globe, Activity, Layers, BarChart3,
  Bell, X, MessageSquare, Phone, Building2, MapPin, Mail, ExternalLink,
  ChevronUp, ChevronDown, Monitor, Smartphone, Package, Users, ShoppingCart, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE } from '@/utils/config';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ 
    totalProducts: 0, totalInquiries: 0, totalRevenue: 0, 
    totalCustomers: 0, lowStockAlerts: 0,
    conversionRate: 0, totalCategories: 0, totalStaff: 0
  });
  const [chartData, setChartData] = useState({ weeklySales: [], topProducts: [] });
  const [activities, setActivities] = useState([]);
  const [liveLeads, setLiveLeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staff, setStaff] = useState([]); 
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const [highlightedLeadId, setHighlightedLeadId] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchGlobalData = async () => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/charts/sales-overview').catch(() => ({ data: { weeklySales: [], topProducts: [] } }))
      ]);
      setStats(statsRes.data || {});
      setChartData(chartRes.data || { weeklySales: [], topProducts: [] });
      
      const logs = await API.get('/admin/activities');
      const cats = await API.get('/categories');
      setCategories(Array.isArray(cats.data) ? cats.data : []);

      const logData = Array.isArray(logs.data) ? logs.data : [];
      setActivities(logData.slice(0, 5).map((l, i) => ({
        id: i, action: l.action, user: l.user, time: new Date(l.created_at).toLocaleTimeString()
      })));
    } catch (err) {
      console.error("Sync Error:", err.message);
    }
  };

  useEffect(() => {
    fetchGlobalData();
    // Refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchGlobalData, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, trend = "" }) => (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }} 
      className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl group overflow-hidden relative framer-motion-optimized"
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={18} />
        </div>
        {trend && (
           <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-[#2E7D32] bg-green-50 px-2 py-1 rounded-lg">+{trend}%</span>
               <div className="w-12 h-1 bg-green-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${trend}%` }} />
               </div>
           </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">
          {title.includes('Revenue') && '₹'}{typeof value === 'number' ? value.toLocaleString() : value}
          {title.includes('Rate') && '%'}
        </h2>
      </div>
      
      {/* Decorative Burst */}
      <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-3xl opacity-20 ${colorClass.split(' ')[0]}`} />
    </motion.div>
  );

  return (
    <PortalLayout role="admin">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* HIGH DENSITY 8-POINT MATRIX */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <StatCard title="Total Products" value={stats.totalProducts} icon={Package} colorClass="bg-blue-50 text-blue-600" />
          <StatCard title="Total Categories" value={stats.totalCategories} icon={Layers} colorClass="bg-indigo-50 text-indigo-600" />
          <StatCard title="Total Inquiries" value={stats.totalInquiries} icon={MessageSquare} colorClass="bg-purple-50 text-purple-600" />
          <StatCard title="Total Customers" value={stats.totalCustomers} icon={Users} colorClass="bg-orange-50 text-orange-600" />
          <StatCard title="Total Revenue" value={stats.totalRevenue} icon={IndianRupee} colorClass="bg-green-50 text-[#2E7D32]" trend="24" />
          <StatCard title="Low Stock Alerts" value={stats.lowStockAlerts} icon={AlertCircle} colorClass="bg-rose-50 text-rose-600" trend="15" />
          <StatCard title="Conversion Rate" value={stats.conversionRate} icon={Target} colorClass="bg-cyan-50 text-cyan-600" trend="8.5" />
        </div>
              
        {/* OVERVIEW CONTENT GRID */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8 framer-motion-optimized"
            >
              {/* VITAL PERFORMANCE FLOWS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. WEEKLY SALES FLOW */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
                  {/* ... same as before, just fixed nesting ... */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-base font-black text-slate-800 uppercase tracking-tight italic">Weekly Sales Flow</h3>
                    </div>
                  </div>
                  <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.weeklySales}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 900}} 
                        />
                        <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. MONTHLY REVENUE BAR CHART */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-base font-black text-slate-800 uppercase tracking-tight italic">Monthly Revenue</h3>
                    </div>
                  </div>
                  <div className="flex-1 w-full min-h-[300px] flex items-end gap-2 px-4">
                     {[45, 30, 60, 40, 80, 55, 90, 70, 100, 85, 95].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                           <div className="w-full bg-slate-50 rounded-full relative overflow-hidden" style={{ height: `${val}%` }}>
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                className={`w-full absolute bottom-0 transition-colors ${i === 8 ? 'bg-[#3B82F6]' : 'bg-[#10B981]'}`}
                              />
                           </div>
                           <span className="text-[8px] font-black text-slate-300 uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][i]}</span>
                        </div>
                     ))}
                  </div>
                </div>
              </div>

              {/* 3. PRODUCT CATEGORIES MATRIX (Visual Section Added) */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                  <div className="flex items-center gap-3">
                    <Layers size={18} className="text-[#2E7D32]" />
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-tight italic">Product Categories</h3>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/categories')}
                    className="text-[9px] font-black text-[#2E7D32] uppercase tracking-widest hover:underline flex items-center gap-2"
                  >
                    Manage Categories <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {categories.filter(c => !c.parent_id).slice(0, 12).map(cat => (
                    <div 
                      key={cat.id} 
                      onClick={() => navigate('/admin/products')} // Navigates to products for filtering or management
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 group-hover:border-[#2E7D32]/30 transition-all group-hover:shadow-lg relative">
                        <img 
                          src={cat.image ? (cat.image.startsWith('http') ? cat.image : `${API_BASE}${cat.image}`) : '/cat-placeholder.jpg'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={cat.name}
                          onError={(e) => { e.target.src = 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/weedmat1_rln1ds.jpg' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-center">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tighter group-hover:text-[#2E7D32] transition-colors">{cat.name}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          {categories.filter(sub => sub.parent_id === cat.id).length} Groups
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add New Category Shortcut */}
                  <div 
                    onClick={() => navigate('/admin/categories')}
                    className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#2E7D32] group transition-all"
                  >
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-300 group-hover:text-[#2E7D32] transition-colors">
                      <Plus size={20} />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#2E7D32]">Add New</span>
                  </div>
                </div>
              </div>

              {/* SECONDARY ANALYTICS MATRIX */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                   <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50 font-black uppercase tracking-widest text-[10px] text-slate-800 italic">
                      <Target size={16} className="text-[#2E7D32]" /> Inquiry Funnel
                   </div>
                    <div className="py-8 text-center bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No funnel data available</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                      <span className="font-black uppercase tracking-widest text-[10px] text-slate-800 italic flex items-center gap-3">
                         <ShoppingBag size={16} className="text-emerald-500" /> Top Selling Products
                      </span>
                   </div>
                   <div className="py-12 text-center bg-slate-50 rounded-3xl">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No transaction data</p>
                   </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                      <span className="font-black uppercase tracking-widest text-[10px] text-slate-800 italic flex items-center gap-3">
                         <Activity size={16} className="text-emerald-500" /> Recent Activity
                      </span>
                   </div>
                                <div className="space-y-4">
                       {activities.length > 0 ? activities.map((act, i) => (
                         <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                            <div className={`p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all`}>
                               <History size={14} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-slate-900 line-clamp-1">{act.action}</span>
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{act.time} • {act.user}</span>
                            </div>
                         </div>
                       )) : (
                         <div className="py-8 text-center bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent protocols</p>
                         </div>
                       )}
                       
                       <button 
                         onClick={() => navigate('/admin/logs')}
                         className="w-full py-3 mt-4 border border-dashed border-slate-200 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:border-emerald-500 hover:text-emerald-500 transition-all active:scale-95"
                       >
                         View Full Audit Trail
                       </button>
                    </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-800 italic">Inventory Matrix</h3>
                <button 
                  onClick={() => navigate('/admin/products')} 
                  className="flex items-center gap-2 px-6 py-3 bg-[#2E7D32] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#1B5E20] transition-all shadow-xl shadow-green-900/10"
                >
                  <Plus size={14} /> Full Inventory
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="py-4 px-2">Product Identity</th>
                      <th className="py-4 px-2">Category</th>
                      <th className="py-4 px-2">Stock Threshold</th>
                      <th className="py-4 px-2 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.productList?.map((prod) => (
                      <tr key={prod.id} className="group hover:bg-slate-50 transition-colors text-xs">
                        <td className="py-4 px-2 font-bold text-slate-800 uppercase tracking-tighter">{prod.name}</td>
                        <td className="py-4 px-2 text-[10px] font-black text-slate-400 uppercase">{prod.category}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${prod.stock <= 10 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#2E7D32]'}`}>
                            {prod.stock} Units
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right font-bold text-slate-900 tracking-tight">₹{prod.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-800 italic">Live Pipeline Synchronization</h3>
                <button onClick={() => navigate('/admin/leads')} className="text-[#2E7D32] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform">Inquiry Hub <ExternalLink size={12}/></button>
              </div>
              <div className="space-y-4">
                {liveLeads.map((lead) => (
                  <motion.div 
                    key={lead.id} 
                    animate={highlightedLeadId === lead.id ? { scale: 1.02, borderColor: '#2E7D32' } : { scale: 1, borderColor: '#f1f5f9' }}
                    className={`flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-white border rounded-[2.5rem] transition-all duration-500 ${highlightedLeadId === lead.id ? 'ring-2 ring-green-600/30 ring-offset-2 shadow-2xl z-10' : 'hover:shadow-lg hover:border-green-100'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <Users size={20}/>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                          Lead ID #{lead.id} {highlightedLeadId === lead.id && <span className="text-[#2E7D32] animate-pulse">● New Acquisition</span>}
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
                         <a href={`https://wa.me/${lead.phone ? lead.phone.replace(/\D/g, '') : ""}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-green-50 text-[#2E7D32] rounded-xl hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm"><MessageSquare size={16} /></a>
                         <a href={`tel:${lead.phone}`} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Phone size={16} /></a>
                      </div>

                      <select onChange={(e) => handleAssign(lead.id, e.target.value)} className="text-[10px] font-black uppercase tracking-widest p-3 bg-slate-50 border-none rounded-xl outline-none min-w-[160px]" value={lead.assigned_to || ""}>
                        <option value="" disabled>Assign Salesman</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      
                       <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${lead.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-[#2E7D32] border-green-100'}`}>● {lead.status}</span>
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