import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScrollText, ShieldCheck, Search, Filter, 
  Download, Clock, User, Activity, 
  AlertTriangle, RefreshCw, FileText
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SystemLogs = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('activity');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/admin/activities');
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Logs sync failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'activity' ? !log.action.toLowerCase().includes('security') : log.action.toLowerCase().includes('security');
    return matchesSearch && matchesTab;
  });

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Time,User,Action"].concat(filteredLogs.map(l => `${new Date(l.created_at).toLocaleString()},${l.user},${l.action}`)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `farmliv_logs_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    toast({ title: "Audit Trail Exported" });
  };

  return (
    <PortalLayout role="admin">
      <div className="space-y-8 font-sans">
        {/* --- Elite Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl">
              <ScrollText size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">System <span className="text-emerald-500">Audit Logs</span></h1>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Activity & Security Logs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={fetchLogs}
               className="p-4 bg-slate-50 text-slate-400 hover:text-emerald-500 rounded-2xl transition-all border border-slate-100"
             >
               <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
             </button>
             <button 
               onClick={exportLogs}
               className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
             >
               <Download size={16} /> Export CSV
             </button>
          </div>
        </div>

        {/* --- Action Bar --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
            <button 
              onClick={() => setActiveTab('activity')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-3xl transition-all font-black uppercase text-[10px] tracking-widest ${activeTab === 'activity' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Activity size={16} /> Activity Stream
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-3xl transition-all font-black uppercase text-[10px] tracking-widest ${activeTab === 'security' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <ShieldCheck size={16} /> Security Events
            </button>
          </div>

          <div className="lg:col-span-4 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Filter logs by action or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-100 pl-16 pr-8 py-6 rounded-[2rem] text-sm font-bold placeholder:text-slate-300 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* --- Log Ledger --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-6 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-6 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  <th className="px-8 py-6 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode='wait'>
                  {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                    <motion.tr 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-slate-50/80 transition-colors framer-motion-optimized"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-slate-300" />
                          <span className="text-[11px] font-bold text-slate-500">
                            {new Date(log.created_at).toLocaleString('en-IN', { 
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <User size={14} />
                          </div>
                          <span className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{log.user}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          log.action.toLowerCase().includes('failed') || log.action.toLowerCase().includes('error') || log.action.toLowerCase().includes('rejected')
                          ? 'bg-rose-50 text-rose-500'
                          : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                          log.action.toLowerCase().includes('failed') || log.action.toLowerCase().includes('error') || log.action.toLowerCase().includes('rejected')
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-emerald-500'
                        }`} />
                          {log.action.toLowerCase().includes('failed') ? 'Critical' : 'Logged'}
                        </span>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <FileText size={40} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase">No Logs Detected</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit trail is currently clean</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default SystemLogs;
