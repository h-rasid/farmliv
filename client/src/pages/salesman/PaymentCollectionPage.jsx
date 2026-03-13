import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, CreditCard, Banknote, Smartphone, 
  Search, Users, Calendar, Clock, CheckCircle2,
  Plus, History, ChevronRight, X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaymentCollectionPage = () => {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    amount: '',
    method: 'cash',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const [payRes, custRes] = await Promise.all([
        API.get(`/salesman/${user.id}/payments`),
        API.get(`/salesman/${user.id}/customers`)
      ]);
      setPayments(payRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error("Ledger Desync");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      await API.post('/payments', { ...formData, salesman_id: user.id });
      toast({ title: "Settlement Synchronized" });
      setShowModal(false);
      setFormData({ customer_id: '', amount: '', method: 'cash', notes: '' });
      fetchData();
    } catch (err) {
      toast({ variant: "destructive", title: "Settlement Failure" });
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24 font-sans text-slate-900">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">Collections</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Fiscal Node Tracking</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="p-4 bg-emerald-600 text-white rounded-[1.5rem] shadow-lg shadow-green-900/20 active:scale-95 transition-all"
          >
             <Plus size={24} />
          </button>
        </header>

        <section className="space-y-4">
           {payments.map(p => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       {p.method === 'upi' ? <Smartphone size={18}/> : p.method === 'bank' ? <CreditCard size={18}/> : <Banknote size={18}/>}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{p.customer_name}</span>
                       <span className="text-sm font-black italic">₹{p.amount.toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Synchronized</span>
                    <p className="text-[8px] mt-1 text-slate-300 font-bold uppercase">{new Date(p.created_at).toLocaleDateString()}</p>
                 </div>
              </motion.div>
           ))}
           {payments.length === 0 && (
              <div className="py-20 text-center text-slate-300">
                 <History size={40} className="mx-auto mb-4 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Recent Settlements</p>
              </div>
           )}
        </section>

        {/* COLLECTION FORM MODAL */}
        <AnimatePresence>
           {showModal && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-end md:items-center justify-center p-4"
              >
                 <motion.div 
                    initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                    className="w-full max-w-sm bg-white rounded-[3rem] p-8 space-y-8 shadow-2xl"
                 >
                    <div className="flex justify-between items-center">
                       <h2 className="text-xl font-black italic uppercase italic tracking-tighter">Record Entry</h2>
                       <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={20}/></button>
                    </div>

                    <form onSubmit={handleRecordPayment} className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Select Node</label>
                          <select 
                            required
                            value={formData.customer_id}
                            onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                            className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-xs font-black uppercase outline-none focus:ring-2 ring-emerald-500/20"
                          >
                             <option value="">Choose Customer...</option>
                             {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Valuation (INR)</label>
                          <input 
                            required
                            type="number" 
                            placeholder="Amount..."
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] text-xs font-black uppercase outline-none focus:ring-2 ring-emerald-500/20 placeholder:text-slate-300"
                          />
                       </div>

                       <div className="grid grid-cols-3 gap-2">
                          {['cash', 'upi', 'bank'].map(m => (
                             <button 
                               key={m}
                               type="button"
                               onClick={() => setFormData({...formData, method: m})}
                               className={`py-4 rounded-2xl text-[8px] font-black uppercase tracking-widest border transition-all ${formData.method === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
                             >
                                {m}
                             </button>
                          ))}
                       </div>

                       <button 
                         type="submit"
                         className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 active:scale-95 transition-all"
                       >
                         Authorize Settlement
                       </button>
                    </form>
                 </motion.div>
              </motion.div>
           )}
        </AnimatePresence>
      </div>
    </PortalLayout>
  );
};

export default PaymentCollectionPage;
