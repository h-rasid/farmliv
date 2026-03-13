import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, IndianRupee, Users, Target, 
  TrendingUp, Activity, PlusCircle, CheckCircle2,
  ChevronRight, Calendar, Star, Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayOrders: 0,
    todaySales: 0,
    totalCustomers: 0,
    newLeads: 0,
    targetAchievement: 0,
    pendingFollowups: 0
  });
  const [activities, setActivities] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSalesVitals();
  }, []);

  const fetchSalesVitals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      if (!user) return;

      const res = await API.get(`/salesman/${user.id}/dashboard-stats`);
      setStats(res.data);
      
      // Mock Activities for visual excellence
      setActivities([
        { id: 1, action: "Order #2041 Confirmed", time: "10 mins ago", icon: <CheckCircle2 size={12}/> },
        { id: 2, action: "New Lead Assigned: Ramesh Kumar", time: "1h ago", icon: <Zap size={12} className="text-amber-500"/> },
        { id: 3, action: "Visit Logged: Kisan Fertilizer", time: "3h ago", icon: <Activity size={12}/> }
      ]);
    } catch (err) {
      console.error("Vitals Out of Sync");
    }
  };

  const QuickStat = ({ title, value, icon: Icon, colorClass, suffix = "" }) => (
    <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${colorClass}`}><Icon size={18} /></div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</span>
        <span className="text-xl font-black text-slate-900 tracking-tighter">
          {suffix === '₹' && '₹'}{typeof value === 'number' ? value.toLocaleString() : value}{suffix === '%' && '%'}
        </span>
      </div>
    </motion.div>
  );

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic">Field Operations</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Success Matrix Active</p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.8 }} 
            onClick={() => navigate('/salesman/new-order')}
            className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-green-900/20"
          >
             <PlusCircle size={24} />
          </motion.button>
        </header>

        {/* PRIMARY VITALS */}
        <div className="grid grid-cols-2 gap-3">
          <QuickStat title="Today's Sales" value={stats.todaySales} icon={IndianRupee} colorClass="bg-emerald-50 text-emerald-600" suffix="₹"/>
          <QuickStat title="Today's Orders" value={stats.todayOrders} icon={ShoppingBag} colorClass="bg-blue-50 text-blue-600" />
          <QuickStat title="New Leads" value={stats.newLeads} icon={Star} colorClass="bg-purple-50 text-purple-600" />
          <QuickStat title="Follow-ups" value={stats.pendingFollowups} icon={Calendar} colorClass="bg-amber-50 text-amber-600" />
        </div>

        {/* PROGRESS CARD */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Target Progress</span>
                 <Target size={16} className="text-emerald-400" />
              </div>
              <div className="flex items-end gap-2 mb-4">
                 <h2 className="text-4xl font-black tracking-tighter italic">{stats.targetAchievement}%</h2>
                 <span className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Achieved</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${stats.targetAchievement}%` }} 
                   className="h-full bg-emerald-500 rounded-full"
                 />
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                 <span>Start: ₹0</span>
                 <span>Target: ₹50,000</span>
              </div>
           </div>
           {/* Abstract Design Elements */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>
             <button 
                onClick={() => navigate('/salesman/catalog')}
                className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group active:bg-slate-50 transition-all font-sans"
             >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Package size={18}/></div>
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900">Product Presentation Hub</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
             </button>

        {/* QUICK ACTIONS */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Quick Commands</h3>
          <div className="grid grid-cols-1 gap-2">
             <button 
                onClick={() => navigate('/salesman/new-order')}
                className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group active:bg-slate-50 transition-all"
             >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><PlusCircle size={18}/></div>
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900">New Order Entry</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
             </button>
             <button 
                onClick={() => navigate('/salesman/payments')}
                className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group active:bg-slate-50 transition-all"
             >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><IndianRupee size={18}/></div>
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900">Payment Collection</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500" />
             </button>
             <button 
                onClick={() => navigate('/salesman/reports')}
                className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group active:bg-slate-50 transition-all"
             >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={18}/></div>
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900">Performance Insights</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-purple-500" />
             </button>
             <button 
                onClick={() => navigate('/salesman/tasks')}
                className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group active:bg-slate-50 transition-all"
             >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><CheckCircle2 size={18}/></div>
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900">Assigned Directives</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-500" />
             </button>
          </div>
        </section>

        {/* FEED */}
        <section className="space-y-4">
           <div className="flex justify-between items-center ml-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Success Feed</h3>
              <TrendingUp size={14} className="text-emerald-500" />
           </div>
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 space-y-6">
              {activities.map(act => (
                <div key={act.id} className="flex gap-4">
                   <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      {act.icon}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{act.action}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{act.time}</span>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </PortalLayout>
  );
};

export default SalesDashboard;