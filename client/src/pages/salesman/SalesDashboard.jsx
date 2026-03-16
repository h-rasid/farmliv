import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, IndianRupee, Users, Target, 
  TrendingUp, Activity, PlusCircle, CheckCircle2,
  ChevronRight, Calendar, Star, Zap, BarChart3, Package, User,
  Bell, Mail, MessageCircle, ChevronDown, LayoutDashboard
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    todayOrders: 0,
    todaySales: 0,
    totalCustomers: 0,
    newLeads: 0,
    targetAchievement: 0,
    pendingFollowups: 0,
    weeklyTrend: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const fetchSalesVitals = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await API.get(`/salesman/${user.id}/dashboard-stats`);
      const data = res.data || {};
      setStats(prev => ({ 
        ...prev, 
        ...data,
        weeklyTrend: Array.isArray(data.weeklyTrend) ? data.weeklyTrend : [],
        recentActivities: Array.isArray(data.recentActivities) ? data.recentActivities : []
      }));
      setLastSync(new Date());
    } catch (err) {
      console.warn("Vitals Out of Sync:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesVitals();
    const interval = setInterval(fetchSalesVitals, 30000); // 30s sync
    return () => clearInterval(interval);
  }, [fetchSalesVitals]);

  const QuickStat = ({ title, value, icon: Icon, colorClass, suffix = "" }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 group transition-all"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Live</span>
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 block">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 tracking-tighter italic">
            {suffix === '₹' && '₹'}{typeof value === 'number' ? value.toLocaleString() : value}{suffix === '%' && '%'}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <PortalLayout role="salesman">
      <div className="flex flex-col gap-8">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Pulse: Sync Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-slate-100 shadow-sm">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs">
                {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Global Update</span>
          </div>
        </div>

        {/* TOP ROW VITALS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <QuickStat title="Today's Orders" value={stats.todayOrders} icon={ShoppingBag} colorClass="bg-emerald-50 text-emerald-600" />
          <QuickStat title="Today's Sales" value={stats.todaySales} icon={IndianRupee} colorClass="bg-blue-50 text-blue-600" suffix="₹" />
          <QuickStat title="Total Customers" value={stats.totalCustomers} icon={Users} colorClass="bg-purple-50 text-purple-600" />
          <QuickStat title="New Leads" value={stats.newLeads} icon={Zap} colorClass="bg-amber-50 text-amber-600" />
          <QuickStat title="Pending Followups" value={stats.pendingFollowups} icon={Calendar} colorClass="bg-rose-50 text-rose-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: TRENDS & ANALYTICS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* PROGRESS OVERVIEW */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Monthly Target vs Achievement</span>
                        <h2 className="text-2xl font-black tracking-tighter italic">Sales Velocity</h2>
                     </div>
                     <Target size={24} className="text-emerald-400 animate-pulse" />
                  </div>
                  
                  <div className="flex items-end gap-3 mb-6">
                     <h3 className="text-6xl font-black tracking-tighter italic text-white group-hover:scale-110 transition-transform origin-left">{stats.targetAchievement}%</h3>
                     <div className="flex flex-col mb-3">
                        <div className="flex items-center gap-1 text-emerald-400">
                           <TrendingUp size={14} />
                           <span className="text-[10px] font-black uppercase leading-none">+12.5%</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Growth Index</span>
                     </div>
                  </div>

                  <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
                     <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: `${stats.targetAchievement}%` }} 
                       transition={{ duration: 1, ease: "easeOut" }}
                       className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                     />
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Current Milestone</span>
                        <span className="text-xs font-bold tracking-tight">₹{(stats.currentSales || 0).toLocaleString()}</span>
                     </div>
                     <div className="h-4 w-px bg-white/10" />
                     <div className="flex flex-col text-right">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">End Goal</span>
                        <span className="text-xs font-bold tracking-tight">₹{(stats.monthlyTarget || 50000).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
               
               {/* Decorative Background Elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
               <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px]" />
            </div>

            {/* WEEKLY TREND CHART */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-6">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                     <h3 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase">Weekly Sales</h3>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">7-Day Operational Trend</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-[10px] font-black text-slate-900 uppercase">Revenue</span>
                  </div>
               </div>
               
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={Array.isArray(stats.weeklyTrend) ? stats.weeklyTrend : []}>
                        <defs>
                           <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis 
                           dataKey="day" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 900}} 
                           dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                           contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                           cursor={{ stroke: '#10B981', strokeWidth: 2 }}
                        />
                        <Area 
                           type="monotone" 
                           dataKey="amount" 
                           stroke="#10B981" 
                           strokeWidth={4}
                           fillOpacity={1} 
                           fill="url(#colorSales)" 
                           animationDuration={2000}
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RECENT ACTIVITY & SUMMARY */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* MONTHLY PROGRESS GAUGE */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center gap-6">
               <div className="w-full">
                  <h3 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase">Monthly Progress</h3>
               </div>
               
               <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={[
                              { name: 'Achieved', value: stats.targetAchievement },
                              { name: 'Remaining', value: 100 - stats.targetAchievement }
                           ]}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           startAngle={90}
                           endAngle={450}
                           paddingAngle={0}
                           dataKey="value"
                        >
                           <Cell fill="#10B981" stroke="none" />
                           <Cell fill="#F1F5F9" stroke="none" />
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-black text-slate-900 italic tracking-tighter">{stats.targetAchievement}%</span>
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Of Target</span>
                  </div>
               </div>
               
               <div className="w-full grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                     <span className="text-[10px] font-black text-slate-400 uppercase mb-1">New Leads</span>
                     <span className="text-xl font-black text-slate-900">120</span>
                  </div>
                  <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                     <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Contacted</span>
                     <span className="text-xl font-black text-slate-900">80</span>
                  </div>
               </div>
            </div>

            {/* RECENT ACTIVITY FEED */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase">Recent Activity</h3>
                  <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:opacity-70 transition-all">View All</button>
               </div>
               
               <div className="space-y-6">
                  {(Array.isArray(stats.recentActivities) ? stats.recentActivities : []).map((log, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 group"
                    >
                       <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all shrink-0">
                             {log.action.includes('Order') ? <ShoppingBag size={18} /> : 
                              log.action.includes('Payment') ? <IndianRupee size={18} /> : 
                              log.action.includes('Lead') ? <Star size={18} /> : <Activity size={18} />}
                          </div>
                          {idx < stats.recentActivities.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-50 my-2" />
                          )}
                       </div>
                       <div className="flex flex-col pb-6 border-b border-slate-50 w-full">
                          <div className="flex justify-between items-start mb-1">
                             <span className="text-xs font-black text-slate-900 uppercase tracking-tighter italic">{log.user}</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{log.action}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default SalesDashboard;