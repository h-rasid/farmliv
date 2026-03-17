import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { 
  TrendingUp, BarChart3, PieChart as PieIcon, 
  TrendingDown, Target, Zap, Filter, Calendar,
  Activity, ArrowUpRight, ArrowDownRight, Award,
  Flame, Globe, ShieldCheck, Download, MoreHorizontal
} from 'lucide-react';

const SalesmanReports = () => {
  const [data, setData] = useState({
    weeklySales: [],
    categoryDistribution: [],
    performanceVitals: {
      conversionRate: 64,
      avgOrderValue: 12500,
      customerGrowth: +12,
      reachOuts: 142
    },
    monthlyTrend: []
  });

  const fetchReports = useCallback(async () => {
     try {
       const userStr = localStorage.getItem('farmliv_salesman');
       if (!userStr) return;
       const user = JSON.parse(userStr);
       const res = await API.get(`/salesman/${user.id}/reports`);
       if (res.data) {
          setData({
             weeklySales: res.data.weeklySales || [],
             categoryDistribution: res.data.categoryDistribution || [],
             performanceVitals: res.data.performanceVitals || { conversionRate: 0, avgOrderValue: 0, customerGrowth: 0, reachOuts: 0 },
             monthlyTrend: res.data.monthlyTrend || []
          });
       }
     } catch (err) {
       console.error("Telemetry Sync Failed:", err.message);
     }
  }, []);

  useEffect(() => {
     fetchReports();
  }, [fetchReports]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const stats = [
    { label: 'Operational Efficiency', val: `${data.performanceVitals.conversionRate}%`, icon: Target, trend: '+2.4%', up: true, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Avg Node Valuation', val: `₹${(data.performanceVitals.avgOrderValue/1000).toFixed(1)}K`, icon: Award, trend: '+1.1%', up: true, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Network Expansion', val: `${data.performanceVitals.customerGrowth}%`, icon: Activity, trend: '+4.5%', up: true, bg: 'bg-amber-50', color: 'text-amber-600' },
    { label: 'Sync Reachouts', val: data.performanceVitals.reachOuts, icon: Zap, trend: '-0.2%', up: false, bg: 'bg-purple-50', color: 'text-purple-600' },
  ];

  return (
    <PortalLayout role="salesman">
      <div className="flex flex-col gap-8">
        
        {/* HEADER & ANALYTICS PULSE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Field Intelligence</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Performance Telemetry</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-slate-900">Q1 Operational Phase</span>
             </div>
             <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2">
                <Download size={16} /> Export Intelligence
             </button>
          </div>
        </div>

        {/* VITALS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {stats.map((s, idx) => (
             <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="flex justify-between items-start relative z-10">
                   <div className={`p-4 rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:scale-110`}>
                      <s.icon size={20} />
                   </div>
                   <div className={`flex items-center gap-1 text-[10px] font-black italic ${s.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {s.trend}
                   </div>
                </div>
                <div className="mt-6 relative z-10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                   <h3 className="text-3xl font-black text-slate-900 leading-none italic tracking-tighter">{s.val}</h3>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute -bottom-6 -right-6 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">
                   <s.icon size={100} />
                </div>
             </div>
           ))}
        </div>

        {/* ANALYTICS VISUALIZATION HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* Primary Flux Area */}
           <div className="lg:col-span-8 bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col gap-8">
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic leading-none">Sales Velocity Flux</h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Volume vs Theoretical Target</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-[9px] font-black uppercase text-slate-400">Actuals</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-slate-100 border border-slate-200" />
                       <span className="text-[9px] font-black uppercase text-slate-400">Baseline</span>
                    </div>
                 </div>
              </div>

              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.weeklySales}>
                    <defs>
                      <linearGradient id="fluxGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dx={-15} />
                    <Tooltip cursor={{stroke: '#f1f5f9', strokeWidth: 2}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: '900', padding: '16px'}} />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#fluxGrad)" activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4, shadow: '0 0 20px rgba(16,185,129,0.5)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Distribution & Performance Matrix */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              
              <div className="bg-slate-900 rounded-[3.5rem] p-8 text-white flex flex-col gap-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-10" />
                 <div className="flex justify-between items-center relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-widest italic">Inventory Matrix</h3>
                    <PieIcon size={16} className="text-slate-500" />
                 </div>
                 <div className="h-[200px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categoryDistribution}
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {data.categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" cornerRadius={12} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Portfolio</span>
                       <span className="text-xl font-black italic text-emerald-400 tracking-tighter">100%</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3 relative z-10 pt-4">
                    {data.categoryDistribution.map((entry, index) => (
                       <div key={entry.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                             <span className="text-[10px] font-black uppercase text-slate-400">{entry.name}</span>
                          </div>
                          <span className="text-xs font-black italic">{entry.value}u</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col gap-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase text-slate-900 italic">Phase Recovery</h3>
                    <Flame size={16} className="text-amber-500" />
                 </div>
                 <div className="flex flex-col gap-4">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Conversion Yield</span>
                          <span className="text-2xl font-black text-slate-900 italic tracking-tighter">Gold Level</span>
                       </div>
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                          <Award size={24} />
                       </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mt-2">Surpassed 84% of field agents in Q1</p>
                 </div>
              </div>

           </div>

        </div>

      </div>
    </PortalLayout>
  );
};

export default SalesmanReports;
;
