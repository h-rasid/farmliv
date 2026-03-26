import React, { useState } from 'react';
import { 
  Megaphone, Plus, Search, Filter, 
  MoreVertical, Mail, MessageCircle, 
  Target, BarChart3, Clock, CheckCircle2,
  Calendar, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { m as motion } from 'framer-motion';

const CampaignCard = ({ campaign }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 opacity-[0.03] -mr-10 -mt-10 group-hover:scale-110 transition-transform ${campaign.color}`}>
      <campaign.icon size={96} />
    </div>
    
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${campaign.bg} ${campaign.color}`}>
        <campaign.icon size={20} />
      </div>
      <div className="flex gap-2">
         <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${campaign.statusBg} ${campaign.statusColor} ${campaign.statusBorder}`}>
            {campaign.status}
         </span>
         <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <MoreVertical size={16} />
         </button>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-1 group-hover:text-[#2E7D32] transition-colors">
          {campaign.name}
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">
          Target: {campaign.target}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
        <div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Reach</span>
          <span className="text-lg font-black text-slate-900">{campaign.reach}</span>
        </div>
        <div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">CTR</span>
          <span className="text-lg font-black text-emerald-600">+{campaign.ctr}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
              <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
            +12
          </div>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em] hover:gap-3 transition-all">
          <span>View Detailed ROI</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

const MarketingCampaigns = () => {
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Total Reach', value: '0', sub: 'Target not set', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Engagement', value: '0%', sub: 'No active campaigns', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Conversion Rate', value: '0%', sub: 'Awaiting data', icon: ArrowUpRight, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
  ];

  const campaigns = [];

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[2px] w-8 bg-[#2E7D32]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2E7D32]">Marketing Hub</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4 italic uppercase">
            Marketing <span className="text-[#2E7D32]">Campaigns</span>
          </h1>
        </div>
        
        <button className="flex items-center gap-3 bg-[#1A1A1A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2E7D32] transition-all shadow-xl shadow-slate-200 self-start lg:self-center">
          <Plus size={18} />
          <span>Launch New Campaign</span>
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">LIVE SYNC</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 italic tracking-tight">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TOOLS & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-100">
        <div className="flex items-center gap-2 px-4 border-r border-slate-100">
          <Search className="text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase tracking-widest placeholder-slate-300 w-48"
          />
        </div>
        
        <div className="flex flex-1 items-center gap-6 overflow-x-auto px-4 hide-scrollbar">
          {['all', 'active', 'drafts', 'completed', 'scheduled'].map((tab) => (
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

        <button className="flex items-center gap-2 px-6 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">
          <Filter size={14} />
          <span>Show Filters</span>
        </button>
      </div>

      {/* CAMPAIGN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
        
        {/* Placeholder for "Add New" */}
        <button className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-4 hover:bg-slate-100 hover:border-[#2E7D32]/30 transition-all group min-h-[300px]">
           <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-[#2E7D32] group-hover:scale-110 transition-all shadow-sm">
              <Plus size={32} />
           </div>
           <div className="text-center">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-[#2E7D32]">Draft New Campaign</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Choose from optimized B2B templates</p>
           </div>
        </button>
      </div>
    </div>
  );
};

export default MarketingCampaigns;
