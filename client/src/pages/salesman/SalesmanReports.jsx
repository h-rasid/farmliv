import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, BarChart3, PieChart as PieIcon, 
  TrendingDown, Target, Zap, Filter
} from 'lucide-react';

const SalesmanReports = () => {
  const [data, setData] = useState({
    weeklySales: [],
    categoryDistribution: [],
    performanceVitals: {
      conversionRate: 64,
      avgOrderValue: 12500,
      customerGrowth: +12
    }
  });

  useEffect(() => {
     // Simulated data injection for performance visualization
     setData({
        weeklySales: [
          { day: 'Mon', sales: 4500 },
          { day: 'Tue', sales: 7200 },
          { day: 'Wed', sales: 3100 },
          { day: 'Thu', sales: 8400 },
          { day: 'Fri', sales: 5600 },
          { day: 'Sat', sales: 9800 },
          { day: 'Sun', sales: 2400 },
        ],
        categoryDistribution: [
          { name: 'Seeds', value: 400 },
          { name: 'Hardware', value: 300 },
          { name: 'Chemicals', value: 300 },
        ],
        performanceVitals: {
          conversionRate: 68,
          avgOrderValue: 14200,
          customerGrowth: +15
        }
     });
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-8 pb-24 font-sans text-slate-900">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">Field Analytics</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Performance Pulse</p>
          </div>
          <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
             <Filter size={20} />
          </button>
        </header>

        <section className="grid grid-cols-2 gap-4">
           <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Efficiency</p>
              <div className="flex items-center gap-2">
                 <span className="text-2xl font-black italic">{data.performanceVitals.conversionRate}%</span>
                 <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Lead Closure</p>
           </div>
           <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/50 mb-2">Avg Order</p>
              <div className="flex items-center gap-2">
                 <span className="text-2xl font-black italic text-emerald-900">₹{data.performanceVitals.avgOrderValue/1000}K</span>
                 <Zap size={14} className="text-emerald-500" />
              </div>
              <p className="text-[8px] font-bold text-emerald-600/50 mt-1 uppercase">Transaction Value</p>
           </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest">Weekly Sales Flux</h3>
              <BarChart3 size={16} className="text-slate-200" />
           </div>
           <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data.weeklySales}>
                    <defs>
                       <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                    <Tooltip cursor={{stroke: '#f1f5f9'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: '900'}} />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest">Portfolio Spread</h3>
              <PieIcon size={16} className="text-slate-200" />
           </div>
           <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={data.categoryDistribution}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={10}
                       dataKey="value"
                    >
                       {data.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                       ))}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</span>
                 <span className="text-lg font-black italic">100%</span>
              </div>
           </div>
           <div className="flex justify-center gap-6">
              {data.categoryDistribution.map((entry, index) => (
                 <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{entry.name}</span>
                 </div>
              ))}
           </div>
        </section>
      </div>
    </PortalLayout>
  );
};

export default SalesmanReports;
