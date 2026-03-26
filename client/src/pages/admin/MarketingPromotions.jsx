import React, { useState } from 'react';
import { 
  Tag, Plus, Search, Filter, 
  MoreVertical, Calendar, Percent, 
  ShoppingBag, Trash2, Edit2, Copy,
  CheckCircle2, AlertCircle, Clock,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { m as motion } from 'framer-motion';

const PromoRow = ({ promo }) => (
  <tr className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 h-24">
    <td className="pl-8 py-4">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${promo.bg} ${promo.color}`}>
          <promo.icon size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-[#2E7D32] transition-colors">
            {promo.name}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            CODE: <span className="text-[#2E7D32] font-black">{promo.code}</span>
          </span>
        </div>
      </div>
    </td>
    <td className="py-4">
      <div className="flex flex-col">
        <span className="text-sm font-black text-slate-900">{promo.value}</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Min. Order: {promo.minOrder}</span>
      </div>
    </td>
    <td className="py-4">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${promo.statusDot}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${promo.statusColor}`}>
           {promo.status}
        </span>
      </div>
    </td>
    <td className="py-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{promo.used} / {promo.total}</span>
        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
           <div 
             className={`h-full ${promo.progressColor} transition-all duration-1000 ease-out`} 
             style={{ width: `${(promo.used / promo.total) * 100}%` }}
           />
        </div>
      </div>
    </td>
    <td className="py-4 pr-8 text-right">
       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500 shadow-sm transition-all" title="Edit Promotion">
             <Edit2 size={14} />
          </button>
          <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-emerald-500 shadow-sm transition-all" title="Copy Code">
             <Copy size={14} />
          </button>
          <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-rose-500 shadow-sm transition-all" title="Delete">
             <Trash2 size={14} />
          </button>
       </div>
    </td>
  </tr>
);

const MarketingPromotions = () => {
  const [activeTab, setActiveTab] = useState('active');

  const promos = [];

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[2px] w-8 bg-[#2E7D32]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2E7D32]">Deals Management</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4 italic uppercase">
            Marketing <span className="text-[#2E7D32]">Promotions</span>
          </h1>
        </div>
        
        <button className="flex items-center gap-3 bg-[#1A1A1A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2E7D32] transition-all shadow-xl shadow-slate-200 self-start lg:self-center">
          <Plus size={18} />
          <span>Create New Promo</span>
        </button>
      </div>

      {/* TOOLS & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 px-6 border-r border-slate-100">
          <Search className="text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search coupon codes..." 
            className="bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase tracking-widest placeholder-slate-300 w-64"
          />
        </div>
        
        <div className="flex flex-1 items-center gap-8 overflow-x-auto px-6 hide-scrollbar">
          {['all', 'active', 'expired', 'scheduled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'text-[#2E7D32] border-b-2 border-[#2E7D32] pb-1' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-8 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all border border-slate-100">
          <Filter size={14} />
          <span>Detailed Filter</span>
        </button>
      </div>

      {/* PROMOTIONS TABLE CANVAS */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="pl-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Promotion Info</th>
              <th className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Discount Value</th>
              <th className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
              <th className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Redemption Rate</th>
              <th className="pr-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <PromoRow key={promo.id} promo={promo} />
            ))}
          </tbody>
        </table>
        
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Awaiting promotion activation</span>
            <div className="flex gap-4">
               <button className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-[#2E7D32] transition-all">
                  <ArrowRight size={18} className="rotate-180" />
               </button>
               <button className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-[#2E7D32] transition-all">
                  <ArrowRight size={18} />
               </button>
            </div>
        </div>
      </div>

      {/* BOTTOM INFO CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-[#1A1A1A] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32]/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2E7D32] mb-4 block">Special Tip</span>
               <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-6 leading-tight">Combine bulk discounts <br/>with seasonal campaigns</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">Data suggests that multi-tier discounts increase average order value by 24% for existing B2B accounts.</p>
               <button className="flex items-center gap-2 text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em] hover:gap-3 transition-all border-b border-[#2E7D32] pb-0.5">
                  <span>Strategy Guide</span>
                  <ChevronRight size={14} />
               </button>
            </div>
         </div>
         
         <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between">
            <div>
               <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <AlertCircle size={24} />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Automated Rules</h3>
               <p className="text-xs font-bold text-emerald-50 leading-relaxed uppercase tracking-widest">Promotion "FARMLIV20" will be automatically disabled once the threshold of 500 redemptions is reached.</p>
            </div>
            <button className="mt-8 px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg self-start">
               Modify Alert Rules
            </button>
         </div>
      </div>
    </div>
  );
};

export default MarketingPromotions;
