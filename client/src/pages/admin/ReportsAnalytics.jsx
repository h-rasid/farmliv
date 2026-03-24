import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';

import { m as motion } from 'framer-motion';
import { 
  BarChart3, PieChart, TrendingUp, Users, Package, 
  Download, Calendar, Filter, FileSpreadsheet, Loader2 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// ⭐ Import updated to relative path because both files are in the same folder
import StaffPerformanceChart from './StaffPerformanceChart';

const ReportsAnalytics = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  // ⭐ State for performance data
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('sales');


  useEffect(() => { 
    fetchAnalytics();
    // ⭐ Fetch chart data on mount
    fetchPerformance();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Analytics Offline" });
      setStats({
        revenue: 1250000,
        conversions: 65,
        topProduct: 'Mulching Film',
        activeDealers: 12,
        monthlyGrowth: '+14%'
      });
    } finally { setLoading(false); }
  };

  // ⭐ New function to fetch chart data from backend
  const fetchPerformance = async () => {
    try {
      const res = await API.get('/admin/reports/staff-performance');
      setPerformanceData(res.data);
    } catch (err) {
      console.error("Performance sync failed");
    }
  };

  const exportToCSV = (data, fileName) => {
    if (!data || data.length === 0) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({ title: "CSV Exported", description: "Report saved to local storage." });
  };

  const reportCards = [
    { id: 'sales', title: 'Sales Report', icon: TrendingUp, desc: 'Overall revenue flow', color: 'text-emerald-600' },
    { id: 'product', title: 'Product Wise', icon: Package, desc: 'Stock & performance', color: 'text-blue-600' },
    { id: 'dealer', title: 'Dealer Report', icon: Users, desc: 'B2B network activity', color: 'text-purple-600' },
    { id: 'conversion', title: 'Conversion Hub', icon: PieChart, desc: 'Lead to order ratio', color: 'text-amber-600' }
  ];

  return (
    <>
      <div className="max-w-[1600px] mx-auto p-10 space-y-12 font-sans text-slate-900">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Farmliv Analytics</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">B2B Performance & Intelligence</p>
          </div>
          <button 
            onClick={() => exportToCSV(performanceData.length > 0 ? performanceData : [stats], 'Farmliv_Global_Report')}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
          >
            <Download size={16} /> Export Data CSV
          </button>
        </header>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Revenue</p>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tighter">₹{stats?.revenue?.toLocaleString()}</h2>
            <p className="text-[10px] text-emerald-500 font-medium mt-2">{stats?.monthlyGrowth} vs last month</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lead Conversion</p>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tighter">{stats?.conversions}%</h2>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${stats?.conversions}%` }} />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active Dealers</p>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tighter">{stats?.activeDealers} Partners</h2>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Verified Farmliv partners</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Top Product</p>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tighter truncate">{stats?.topProduct}</h2>
            <p className="text-[10px] text-blue-500 font-medium mt-2">Highest demand volume</p>
          </div>
        </div>

        {/* Report Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {reportCards.map((card) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={card.id}
              onClick={() => {
                setReportType(card.id);
                toast({ title: `${card.title} Activated` });
              }}
              className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all ${
                reportType === card.id ? 'bg-white border-emerald-500 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 ${card.color}`}>
                <card.icon size={24} />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-tight">{card.title}</h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ⭐ Visual Chart Section */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm mt-8">
          <div className="mb-10">
            <h3 className="text-lg font-semibold uppercase tracking-tight">Executive Performance Intelligence</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Analyzing lead acquisition versus conversion efficiency</p>
          </div>
          
          <div className="h-[450px] w-full">
            {performanceData.length > 0 ? (
              <StaffPerformanceChart data={performanceData} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="animate-spin text-slate-200" size={40} />
                <p className="text-[10px] text-slate-300 uppercase font-bold tracking-widest">Synchronizing Performance Data...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default ReportsAnalytics;
