import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, 
  ChevronRight, ChevronLeft, CheckCircle2, 
  Users, Package, IndianRupee, Truck
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SalesOrderCreation = () => {
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const [custRes, prodRes] = await Promise.all([
        API.get(`/salesman/${user.id}/customers`),
        API.get('/products')
      ]);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Farmliv Sync Interrupted" });
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast({ title: `${product.name} appended to order` });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const handleFinalSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const orderData = {
        customer_id: selectedCustomer.id,
        salesman_id: user.id,
        total_amount: calculateTotal(),
        items: cart.map(item => ({
          product_id: item.id,
          qty: item.qty,
          price: item.price
        }))
      };

      await API.post('/orders', orderData);
      toast({ title: "Transaction Synchronized Successfully" });
      navigate('/salesman-portal');
    } catch (err) {
      toast({ variant: "destructive", title: "Order Protocol Failed" });
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24 font-sans">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">New Order</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Genesis Protocol: Step {step}/3</p>
          </div>
          <div className="flex gap-1">
             {[1, 2, 3].map(s => (
                <div key={s} className={`w-6 h-1 rounded-full ${step >= s ? 'bg-emerald-500' : 'bg-slate-100'}`} />
             ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* STEP 1: CUSTOMER IDENTIFICATION */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
               <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                   type="text" 
                   placeholder="Identify Customer..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
                 />
               </div>
               <div className="space-y-3">
                  {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                     <button 
                       key={c.id}
                       onClick={() => { setSelectedCustomer(c); setStep(2); }}
                       className={`w-full p-6 rounded-[2.5rem] border flex items-center justify-between transition-all ${selectedCustomer?.id === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-100'}`}
                     >
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                              <Users size={18} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-black uppercase tracking-tight">{c.name}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.location || 'Pan-India'}</span>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                     </button>
                  ))}
               </div>
            </motion.div>
          )}

          {/* STEP 2: INVENTORY SELECTION */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex justify-between items-center px-2">
                   <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><ChevronLeft size={14}/> Back</button>
                   <button onClick={() => setStep(3)} disabled={cart.length === 0} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50">Review Order</button>
                </div>
                <div className="space-y-4">
                   {products.map(p => {
                      const inCart = cart.find(item => item.id === p.id);
                      return (
                        <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group">
                           <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{p.name}</span>
                              <span className="text-[10px] font-black text-emerald-600 uppercase">₹{p.price}</span>
                           </div>
                           {inCart ? (
                              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
                                 <button onClick={() => updateQty(p.id, -1)} className="text-slate-400"><Minus size={14}/></button>
                                 <span className="text-xs font-black w-4 text-center">{inCart.qty}</span>
                                 <button onClick={() => updateQty(p.id, 1)} className="text-slate-900"><Plus size={14}/></button>
                              </div>
                           ) : (
                              <button onClick={() => addToCart(p)} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">
                                 <Plus size={16} />
                              </button>
                           )}
                        </div>
                      );
                   })}
                </div>
            </motion.div>
          )}

          {/* STEP 3: TRANSACTION REVIEW */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-slate-900">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-6">
                   <div className="flex justify-between items-start border-b border-white/10 pb-4">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Identity</span>
                         <span className="text-xl font-black italic">{selectedCustomer?.name}</span>
                      </div>
                      <CheckCircle2 className="text-emerald-400" size={24} />
                   </div>
                   
                   <div className="space-y-4">
                      {cart.map(item => (
                         <div key={item.id} className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                            <span className="text-slate-400 truncate w-32">{item.qty}x {item.name}</span>
                            <span>₹{(item.price * item.qty).toLocaleString()}</span>
                         </div>
                      ))}
                   </div>

                   <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grand Total</span>
                         <span className="text-2xl font-black italic text-emerald-400">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Post-Review</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <button 
                     onClick={handleFinalSubmit}
                     className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 active:scale-95 transition-all"
                   >
                     Synchronize Order
                   </button>
                   <button 
                     onClick={() => setStep(2)}
                     className="w-full py-5 bg-white border border-slate-100 text-slate-400 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
                   >
                     Revise Selection
                   </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PortalLayout>
  );
};

export default SalesOrderCreation;
