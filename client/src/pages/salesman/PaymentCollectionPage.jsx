import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, CreditCard, Banknote, Smartphone, 
  Search, Users, Calendar, Clock, CheckCircle2,
  Plus, History, ChevronRight, X,
  Activity, ArrowUpRight, ShieldCheck, Globe,
  MoreHorizontal, Download, Filter, Wallet,
  Receipt, Landmark
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaymentCollectionPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    amount: '',
    method: 'cash',
    notes: ''
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const [payRes, custRes] = await Promise.all([
        API.get(`/salesman/${user.id}/payments`),
        API.get(`/salesman/${user.id}/customers`)
      ]);
      setPayments(Array.isArray(payRes.data) ? payRes.data : []);
      setFilteredPayments(Array.isArray(payRes.data) ? payRes.data : []);
      setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
    } catch (err) {
      console.error("Ledger Desync");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const data = Array.isArray(payments) ? payments : [];
    let result = data.filter(p => {
      if (!p) return false;
      return p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.id.toString().includes(searchTerm);
    });

    if (filterMethod !== 'all') {
      result = result.filter(p => p.method?.toLowerCase() === filterMethod.toLowerCase());
    }

    setFilteredPayments(result);
  }, [searchTerm, filterMethod, payments]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      const user = JSON.parse(userStr);
      await API.post('/payments', { ...formData, salesman_id: user.id });
      toast({ title: "Settlement Synchronized", description: "Record successfully appended to the fiscal ledger." });
      setShowModal(false);
      setFormData({ customer_id: '', amount: '', method: 'cash', notes: '' });
      fetchData();
    } catch (err) {
      toast({ variant: "destructive", title: "Settlement Failure" });
    }
  };

  const totalCollected = (Array.isArray(payments) ? payments : []).reduce((acc, curr) => acc + parseFloat(curr?.amount || 0), 0);

  return (
    <>
      <div className="flex flex-col gap-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
           <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Fiscal Bridge</h1>
              <div className="flex items-center gap-2 mt-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Capital Intake</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Wallet size={16} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Gross Intake</span>
                    <span className="text-base font-black italic">₹{totalCollected.toLocaleString()}</span>
                 </div>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2"
              >
                 <Plus size={16} /> Record Entry
              </button>
           </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                 type="text" 
                 placeholder="Search Ledger by Customer or Transaction Node..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-4 ring-emerald-500/5 outline-none shadow-sm transition-all font-medium"
              />
           </div>
           <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-full md:w-auto">
              {['all', 'cash', 'upi', 'bank'].map((m) => (
                 <button
                    key={m}
                    onClick={() => setFilterMethod(m)}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterMethod === m ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    {m}
                 </button>
              ))}
           </div>
        </div>

        {/* DATA MATRIX */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden group">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ledger ID</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payer Entity</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intake Protocol</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valuation</th>
                       <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                       <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Auth Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                       {filteredPayments.map((p) => (
                          <motion.tr 
                             layout
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             key={p.id} 
                             className="hover:bg-slate-50/50 transition-colors group/row"
                          >
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover/row:bg-emerald-50 group-hover/row:text-emerald-600 transition-all border border-transparent group-hover/row:border-emerald-100">
                                      <Receipt size={18} />
                                   </div>
                                   <span className="text-[11px] font-black text-slate-900 tracking-wider">SET-{p.id.toString().padStart(6, '0')}</span>
                                </div>
                             </td>
                             <td className="px-10 py-8 text-sm font-black text-slate-800 uppercase italic tracking-tight">{p.customer_name}</td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-2">
                                   <div className={`p-2 rounded-lg ${p.method === 'upi' ? 'bg-blue-50 text-blue-500' : p.method === 'bank' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                      {p.method === 'upi' ? <Smartphone size={14} /> : p.method === 'bank' ? <Landmark size={14} /> : <Banknote size={14} />}
                                   </div>
                                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                      {p.method} Protocol
                                   </span>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-1 text-emerald-600 font-black italic text-lg leading-none">
                                   <IndianRupee size={16} /> 
                                   {parseFloat(p.amount).toLocaleString()}
                                </div>
                             </td>
                             <td className="px-10 py-8 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                {new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[8px] font-black uppercase tracking-widest">
                                   <ShieldCheck size={12} /> Verified
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                    </AnimatePresence>
                 </tbody>
              </table>
           </div>
           
           {(filteredPayments.length === 0 && !loading) && (
              <div className="py-32 flex flex-col items-center justify-center text-center px-10">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                    <History size={40} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Null Settlement Matrix</h3>
                 <p className="max-w-xs text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">No intake signals detected within the current search vectors.</p>
              </div>
           )}

           {loading && (
              <div className="py-32 flex items-center justify-center">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                 </div>
              </div>
           )}
        </div>

        {/* COLLECTION WIZARD MODAL */}
        <AnimatePresence>
           {showModal && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6"
              >
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-xl bg-white rounded-[4rem] p-12 space-y-10 shadow-2xl relative overflow-hidden"
                 >
                    {/* Design Flourish */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="flex justify-between items-center relative z-10">
                       <div className="flex flex-col">
                          <h2 className="text-3xl font-black italic uppercase italic tracking-tighter text-slate-900">Fiscal Entry</h2>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Capital Inflow Protocol</span>
                          </div>
                       </div>
                       <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 flex items-center justify-center transition-colors">
                          <X size={20}/>
                       </button>
                    </div>

                    <form onSubmit={handleRecordPayment} className="space-y-8 relative z-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                <Users size={12} /> Target Node
                             </label>
                             <select 
                               required
                               value={formData.customer_id}
                               onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                               className="w-full px-6 py-5 bg-slate-50 border border-transparent focus:border-emerald-500/20 rounded-[2rem] text-xs font-black uppercase outline-none focus:ring-4 ring-emerald-500/5 transition-all appearance-none"
                             >
                                <option value="">Identify Node...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                             </select>
                          </div>

                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                <IndianRupee size={12} /> Valuation
                             </label>
                             <input 
                               required
                               type="number" 
                               placeholder="Entry Amount..."
                               value={formData.amount}
                               onChange={(e) => setFormData({...formData, amount: e.target.value})}
                               className="w-full px-6 py-5 bg-slate-50 border border-transparent focus:border-emerald-500/20 rounded-[2rem] text-xs font-black uppercase outline-none focus:ring-4 ring-emerald-500/5 transition-all placeholder:text-slate-300"
                             />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Protocol Mechanism</label>
                          <div className="grid grid-cols-3 gap-3">
                             {[
                                { id: 'cash', icon: Banknote, label: 'Cash Flow' },
                                { id: 'upi', icon: Smartphone, label: 'Digital Hub' },
                                { id: 'bank', icon: Landmark, label: 'Bank Bridge' }
                             ].map(m => (
                                <button 
                                  key={m.id}
                                  type="button"
                                  onClick={() => setFormData({...formData, method: m.id})}
                                  className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border transition-all ${formData.method === m.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                                >
                                   <m.icon size={20} />
                                   <span className="text-[8px] font-black uppercase tracking-widest">{m.label}</span>
                                </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                              <History size={12} /> Narrative Logs
                           </label>
                           <textarea 
                             rows="2"
                             placeholder="Internal documentation notes..."
                             value={formData.notes}
                             onChange={(e) => setFormData({...formData, notes: e.target.value})}
                             className="w-full px-6 py-5 bg-slate-50 border border-transparent focus:border-emerald-500/20 rounded-[2rem] text-xs font-bold font-sans outline-none focus:ring-4 ring-emerald-500/5 transition-all resize-none placeholder:text-slate-300"
                           />
                       </div>

                       <button 
                         type="submit"
                         className="w-full py-6 bg-emerald-600 text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                       >
                         <ShieldCheck size={18} /> Authorize & Sync Entry
                       </button>
                    </form>
                 </motion.div>
              </motion.div>
           )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PaymentCollectionPage;
;
