import React, { useState, useEffect } from 'react';
import axios from '@/utils/axios';

import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, IndianRupee, FileText, CheckCircle2, 
  Clock, AlertCircle, TrendingUp, Search, Filter,
  Download, Share2, Plus, ArrowUpRight, ArrowDownRight,
  Printer, MoreHorizontal, ChevronRight, Calculator,
  Zap, Calendar, Building2, History
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BillingFinance = () => {
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReceivables: 0,
    receivedToday: 0,
    pendingInvoices: 0,
    fiscalHealth: 0
  });
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const [statsRes, invoicesRes, paymentsRes] = await Promise.all([
        axios.get('/api/billing/stats'),
        axios.get('/api/billing/invoices'),
        axios.get('/api/billing/payments')
      ]);
      
      setStats(statsRes.data);
      setInvoices(Array.isArray(invoicesRes.data) ? invoicesRes.data : []);
      setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
    } catch (err) {
      console.error("Finance Sync Error:", err);
      toast({
        title: "Sync Error",
        description: "Displaying cached financial data due to sync delay.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const FiscalCard = ({ title, value, icon: Icon, colorClass, trend, subtext }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group h-full relative overflow-hidden"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={20} />
        </div>
        <div className="text-right">
          <span className={`text-[10px] font-black ${trend > 0 ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'} px-3 py-1.5 rounded-full uppercase tracking-widest`}>
            {trend > 0 ? '+' : ''}{trend}% Growth
          </span>
        </div>
      </div>
      
      <div className="mt-8 relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none flex items-baseline gap-1">
          {title.includes('Amount') || title.includes('Receivables') || title.includes('Today') ? '₹' : ''}
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h2>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">{subtext}</p>
      </div>

      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 ${colorClass.split(' ')[0]}`} />
    </motion.div>
  );

  return (
    <>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Finance Hub</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.3em] font-black flex items-center gap-2">
              <Zap size={10} className="text-amber-500 fill-amber-500" /> Real-time Financial Tracking
            </p>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-3 px-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-xl transition-all">
                 <Filter size={16} className="text-[#2E7D32]" /> Filter Data
             </button>
             <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2E7D32] transition-all shadow-xl shadow-slate-900/10">
                 <Plus size={16} /> New Invoice
             </button>
          </div>
        </header>

        {/* FINANCIAL VITALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FiscalCard 
            title="Total Receivables" 
            value={stats.totalReceivables} 
            icon={IndianRupee} 
            colorClass="bg-red-50 text-red-600"
            trend={-4.2}
            subtext="Outstanding Market Credit"
          />
          <FiscalCard 
            title="Received Today" 
            value={stats.receivedToday} 
            icon={TrendingUp} 
            colorClass="bg-emerald-50 text-emerald-600"
            trend={12.8}
            subtext="Real-time Cash Flow"
          />
          <FiscalCard 
            title="Pending Invoices" 
            value={stats.pendingInvoices} 
            icon={Clock} 
            colorClass="bg-amber-50 text-amber-600"
            trend={+2}
            subtext="Awaiting Verification"
          />
          <FiscalCard 
            title="Fiscal Health" 
            value={`${stats.fiscalHealth}%`} 
            icon={Zap} 
            colorClass="bg-blue-50 text-blue-600"
            trend={+1.5}
            subtext="Transaction Success Rate"
          />
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-10 border-b border-slate-100 pb-2">
           {['overview', 'invoices', 'payments'].map(view => (
              <button 
                key={view}
                onClick={() => setActiveView(view)}
                className={`text-[11px] font-black uppercase tracking-[0.3em] pb-4 transition-all relative ${activeView === view ? 'text-[#2E7D32]' : 'text-slate-300 hover:text-slate-600'}`}
              >
                {view}
                {activeView === view && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E7D32] rounded-full" />}
              </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div 
               key="overview"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
               {/* LATEST TRANSACTIONS FLOW */}
               <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 italic flex items-center gap-3">
                           <History size={18} className="text-[#2E7D32]" /> Recent Invoices
                        </span>
                        <ChevronRight size={18} className="text-slate-300" />
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50/50">
                              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                  <th className="px-10 py-6">Invoice ID</th>
                                 <th className="px-10 py-6">Customer</th>
                                 <th className="px-10 py-6 text-right">Amount</th>
                                 <th className="px-10 py-6">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {invoices.slice(0, 5).map((inv) => (
                                 <tr key={inv.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                                    <td className="px-10 py-6">
                                       <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{inv.invoice_number}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                       <div className="flex flex-col">
                                          <span className="text-[11px] font-bold text-slate-600 uppercase italic leading-none">{inv.customer_name}</span>
                                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Ref: Order #{inv.order_ref}</span>
                                       </div>
                                    </td>
                                    <td className="px-10 py-6 text-right font-black text-slate-900 text-xs">₹{parseFloat(inv.total_amount).toLocaleString()}</td>
                                    <td className="px-10 py-6">
                                       <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                          {inv.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* RECENT PAYMENTS FEED */}
               <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                     <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 italic flex items-center gap-3 mb-8">
                        <CreditCard size={18} className="text-[#2E7D32]" /> Recent Payments
                     </span>
                     <div className="space-y-6">
                        {payments.slice(0, 4).map((pay) => (
                           <div key={pay.id} className="flex gap-5 group cursor-pointer">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#2E7D32]/10 group-hover:text-[#2E7D32] transition-all">
                                 <ArrowDownRight size={20} />
                              </div>
                              <div className="flex-1 border-b border-slate-50 pb-6 group-last:border-none">
                                 <div className="flex justify-between items-start">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter truncate w-32">{pay.customer_name}</span>
                                    <span className="text-xs font-black text-slate-900 tracking-tight">+₹{parseFloat(pay.amount).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center mt-2">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                       <Zap size={10} className="text-emerald-500" /> {pay.method}
                                    </span>
                                    <span className="text-[8px] font-black text-slate-300 uppercase italic">{new Date(pay.created_at).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="w-full mt-6 py-4 rounded-2xl bg-slate-50 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-[#2E7D32] hover:text-white transition-all">
                        View All Transactions
                     </button>
                  </div>
               </div>
            </motion.div>
          )}

          {activeView === 'invoices' && (
            <motion.div 
               key="invoices"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden"
            >
               {/* FULL INVOICE LIST VIEW */}
               <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                     <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                           type="text" 
                           placeholder="Search Invoices..." 
                           className="pl-12 pr-6 py-4 bg-slate-50 rounded-2xl text-[11px] uppercase font-black tracking-widest outline-none w-full md:w-64 border-none focus:ring-2 focus:ring-[#2E7D32]/20"
                        />
                     </div>
                     <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#2E7D32] transition-all">
                        <Filter size={20} />
                     </button>
                  </div>
                  <div className="flex gap-4">
                     <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-100">
                        <Download size={14} /> EXPORT CSV
                     </button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                           <th className="px-10 py-6">ID</th>
                           <th className="px-10 py-6">Customer</th>
                           <th className="px-10 py-6">Issue Date</th>
                           <th className="px-10 py-6">Due Date</th>
                           <th className="px-10 py-6 text-right">Subtotal</th>
                           <th className="px-10 py-6 text-right">GST (18%)</th>
                           <th className="px-10 py-6 text-right">Total</th>
                           <th className="px-10 py-6">Status</th>
                           <th className="px-10 py-6">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {invoices.map((inv) => (
                           <tr key={inv.id} className="hover:bg-slate-50 transition-all text-xs">
                              <td className="px-10 py-6 font-black text-slate-900">{inv.invoice_number}</td>
                              <td className="px-10 py-6 font-bold text-slate-600 uppercase italic">{inv.customer_name}</td>
                              <td className="px-10 py-6 text-slate-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                              <td className="px-10 py-6 text-slate-400">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'N/A'}</td>
                              <td className="px-10 py-6 text-right font-black text-slate-500">₹{parseFloat(inv.subtotal).toLocaleString()}</td>
                              <td className="px-10 py-6 text-right font-black text-emerald-500">₹{parseFloat(inv.tax_amount).toLocaleString()}</td>
                              <td className="px-10 py-6 text-right font-black text-slate-900">₹{parseFloat(inv.total_amount).toLocaleString()}</td>
                              <td className="px-10 py-6">
                                 <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {inv.status}
                                 </span>
                              </td>
                              <td className="px-10 py-6">
                                 <div className="flex gap-2">
                                    <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-500 transition-all"><Printer size={14} /></button>
                                    <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-blue-500 transition-all"><Download size={14} /></button>
                                    <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"><MoreHorizontal size={14} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {activeView === 'payments' && (
            <motion.div 
               key="payments"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
               {/* PAYMENT MATRIX */}
               <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
                  <div className="p-8 border-b border-slate-50">
                     <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 italic">Payment History</span>
                  </div>
                  <div className="p-10 space-y-8">
                     {payments.map(pay => (
                        <div key={pay.id} className="flex justify-between items-center group">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32]/5 group-hover:border-[#2E7D32]/20 transition-all">
                                 <CreditCard size={24} className="text-[#2E7D32]" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{pay.customer_name}</span>
                                 <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pay.method}</span>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">ID: {pay.transaction_id || 'CASH-REF'}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col text-right">
                              <span className="text-sm font-black text-slate-900 tracking-tight">₹{parseFloat(pay.amount).toLocaleString()}</span>
                              <span className="text-[8px] font-black text-slate-300 uppercase italic mt-1">{new Date(pay.created_at).toLocaleTimeString()}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* SETTLEMENT TRACKER */}
               <div className="bg-[#1B5E20] p-12 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl shadow-green-900/30 relative overflow-hidden h-full">
                  <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Financial Status</span>
                     <h3 className="text-4xl font-black italic tracking-tighter uppercase mt-4">Ledger Overview</h3>
                     
                     <div className="mt-12 space-y-10">
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                               <span className="text-[11px] font-black uppercase tracking-widest opacity-60 italic">Revenue Target</span>
                              <span className="text-2xl font-black tracking-tighter italic">₹1.2M <span className="text-[10px] opacity-40">TARGET</span></span>
                           </div>
                           <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: '68%' }}
                                 className="h-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                              />
                           </div>
                        </div>

                        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-300">Sync Information</h4>
                           <div className="grid grid-cols-2 gap-8">
                              <div>
                                 <span className="text-[8px] font-black uppercase opacity-40 block mb-1">Last Update</span>
                                 <span className="text-[11px] font-bold">14 Mar 2024</span>
                              </div>
                              <div>
                                  <span className="text-[8px] font-black uppercase opacity-40 block mb-1">Status</span>
                                 <span className="text-[11px] font-bold text-green-400">ONLINE</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <button className="mt-12 w-full py-5 bg-white text-[#1B5E20] rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all relative z-10">
                     Download Monthly Balance
                  </button>

                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 blur-[120px] opacity-20 -mr-32 -mt-32" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BillingFinance;

