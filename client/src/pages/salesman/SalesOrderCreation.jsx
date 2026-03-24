import React, { useState, useEffect, useCallback } from 'react';
import API from '@/utils/axios';

import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, 
  ChevronRight, ChevronLeft, CheckCircle2, 
  Users, Package, IndianRupee, Truck,
  Target, Zap, ArrowRight, ShieldCheck,
  CreditCard, Boxes, Info, ShoppingCart
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

  const fetchData = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('farmliv_salesman');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const [custRes, prodRes] = await Promise.all([
        API.get(`salesman/${user.id}/customers`),
        API.get('products')
      ]);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Farmliv Sync Interrupted:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast({ title: `${product.name} Appended`, description: "Item added to transaction buffer." });
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
      const userStr = localStorage.getItem('farmliv_salesman');
      const user = JSON.parse(userStr);
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

      await API.post('orders', orderData);
      toast({ title: "Transaction Synchronized", description: "Order identity recorded in mainframe." });
      navigate('/salesman-portal');
    } catch (err) {
      toast({ variant: "destructive", title: "Order Protocol Failed" });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* WIZARD PROGRESS HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Order Genesis</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Protocol Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-3 rounded-3xl border border-slate-100 shadow-sm">
             {[
               { id: 1, label: 'Identity', icon: Users },
               { id: 2, label: 'Inventory', icon: Boxes },
               { id: 3, label: 'Finalize', icon: ShieldCheck }
             ].map((s, idx) => (
               <React.Fragment key={s.id}>
                 <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${step === s.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 opacity-60'}`}>
                    <s.icon size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{s.label}</span>
                 </div>
                 {idx < 2 && <ArrowRight size={14} className="text-slate-200" />}
               </React.Fragment>
             ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: CUSTOMER IDENTIFICATION */}
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="space-y-8"
            >
               <div className="relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                 <input 
                   type="text" 
                   placeholder="Identify Merchant Node by Name or Location..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[2.5rem] text-sm focus:ring-4 ring-emerald-500/5 shadow-sm transition-all outline-none"
                 />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                     <motion.button 
                       whileHover={{ y: -5 }}
                       key={c.id}
                       onClick={() => { setSelectedCustomer(c); setStep(2); }}
                       className={`p-8 rounded-[3rem] border text-left transition-all ${selectedCustomer?.id === c.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-900 border-slate-100 hover:shadow-xl'}`}
                     >
                        <div className="flex flex-col gap-6">
                           <div className="flex justify-between items-start">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                 <Users size={20} />
                              </div>
                              <ChevronRight size={18} className="text-slate-300" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-lg font-black uppercase tracking-tighter italic leading-none">{c.name}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{c.company || "Farmliv Partner Node"}</span>
                           </div>
                           <div className="flex items-center gap-2 text-slate-400">
                              <MapPin size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-tight">{c.location || "North East Segment"}</span>
                           </div>
                        </div>
                     </motion.button>
                  ))}
               </div>
            </motion.div>
          )}

          {/* STEP 2: INVENTORY SELECTION */}
          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
               {/* Product Grid */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                     <button onClick={() => setStep(1)} className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">
                        <ChevronLeft size={16}/> Revise Identity
                     </button>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Available Inventory: {products.length} Units
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {products.map(p => {
                        const inCart = cart.find(item => item.id === p.id);
                        return (
                          <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none">{p.name}</span>
                                <span className="text-xl font-black text-emerald-600 italic mt-1">₹{p.price}</span>
                             </div>
                             {inCart ? (
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                   <button onClick={() => updateQty(p.id, -1)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Minus size={14}/></button>
                                   <span className="text-xs font-black min-w-[20px] text-center italic">{inCart.qty}</span>
                                   <button onClick={() => updateQty(p.id, 1)} className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg"><Plus size={14}/></button>
                                </div>
                             ) : (
                                <button onClick={() => addToCart(p)} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                   <Plus size={20} />
                                </button>
                             )}
                          </div>
                        );
                     })}
                  </div>
               </div>

               {/* Cart Summary Sidebars */}
               <div className="lg:col-span-4 sticky top-8">
                  <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl flex flex-col gap-8">
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Selected Merchant</span>
                           <h3 className="text-lg font-black italic">{selectedCustomer?.name}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                           <ShoppingCart size={20} className="text-emerald-400" />
                        </div>
                     </div>

                     <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map(item => (
                           <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-4">
                              <div className="flex flex-col">
                                 <span className="text-xs font-black italic">{item.name}</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase">{item.qty} Units • ₹{item.price}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-black italic">₹{(item.price * item.qty).toLocaleString()}</span>
                                 <button onClick={() => removeFromCart(item.id)} className="text-rose-500 opacity-50 hover:opacity-100"><Trash2 size={14} /></button>
                              </div>
                           </div>
                        ))}
                        {cart.length === 0 && (
                           <div className="py-12 text-center">
                              <Package size={32} className="mx-auto text-slate-700 mb-2 opacity-50" />
                              <p className="text-[10px] font-black text-slate-500 uppercase">Cart Buffer Empty</p>
                           </div>
                        )}
                     </div>

                     <div className="pt-6 border-t border-white/10 flex flex-col gap-6">
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Valuation</span>
                              <span className="text-3xl font-black italic text-emerald-400 tracking-tighter">₹{calculateTotal().toLocaleString()}</span>
                           </div>
                           <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-widest">
                              Pre-Sync Val
                           </div>
                        </div>
                        <button 
                           onClick={() => setStep(3)} 
                           disabled={cart.length === 0} 
                           className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                        >
                           Genesis Protocol <ArrowRight size={16} />
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* STEP 3: TRANSACTION REVIEW */}
          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="max-w-2xl mx-auto w-full"
            >
                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl flex flex-col gap-10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                   
                   <div className="flex justify-between items-start relative z-10">
                      <div className="flex flex-col gap-2">
                         <h2 className="text-3xl font-black italic italic tracking-tighter uppercase leading-none">Review Sync</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Readiness Check</p>
                      </div>
                      <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white rounded-3xl shadow-xl rotate-3">
                         <ShieldCheck size={32} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Merchant Entity</span>
                         <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                            <Users size={18} className="text-slate-400" />
                            <span className="text-sm font-black italic">{selectedCustomer?.name}</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fulfillment Type</span>
                         <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                            <Truck size={18} className="text-slate-400" />
                            <span className="text-sm font-black italic">Standard Logistics</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Breakdown</span>
                      <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-50 flex flex-col gap-4">
                         {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                               <span className="text-slate-600">{item.qty}x {item.name}</span>
                               <span className="font-black italic">₹{(item.price * item.qty).toLocaleString()}</span>
                            </div>
                         ))}
                         <div className="pt-4 border-t border-slate-200 mt-2 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-slate-400">Total Transaction Value</span>
                            <span className="text-2xl font-black italic text-emerald-600 tracking-tighter">₹{calculateTotal().toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col md:flex-row gap-4">
                      <button 
                        onClick={handleFinalSubmit}
                        className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 active:scale-95 transition-all"
                      >
                        Authorize & Sync
                      </button>
                      <button 
                        onClick={() => setStep(2)}
                        className="px-10 py-6 bg-slate-50 text-slate-400 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] active:scale-95 transition-all outline-none"
                      >
                        Adjust
                      </button>
                   </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SalesOrderCreation;
