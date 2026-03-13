import React, { useState, useEffect } from 'react';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, Plus, ShoppingBag, User, Calendar, 
  ChevronRight, Download, Send, Trash2, Search,
  CheckCircle2, AlertCircle, FileText, History,
  IndianRupee, Printer, Mail, Share2
} from 'lucide-react';
import API from '@/utils/axios';
import { useToast } from '@/components/ui/use-toast';

const QuoteEngine = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', company: '', phone: '', email: '' });
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    if (activeTab === 'history') fetchQuoteHistory();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchQuoteHistory = async () => {
    try {
      // Mock or actual endpoint if exists
      // const res = await API.get('/admin/quotes');
      // setQuotes(res.data);
      
      // Temporary mock data for UI visual
      setQuotes([
        { id: 'Q-7801', customer: 'Green Valley Farms', date: '2026-03-10', amount: 45000, status: 'Sent' },
        { id: 'Q-7802', customer: 'Agro Corp', date: '2026-03-11', amount: 120000, status: 'Draft' },
        { id: 'Q-7803', customer: 'Rahul Sharma', date: '2026-03-12', amount: 8500, status: 'Accepted' },
      ]);
    } catch (err) {
      console.error("Error fetching quotes", err);
    }
  };

  const addProductToQuote = (prod) => {
    const existing = selectedProducts.find(p => p.id === prod.id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === prod.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...prod, quantity: 1 }]);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };

  const updateQuantity = (id, q) => {
    if (q < 1) return;
    setSelectedProducts(selectedProducts.map(p => 
      p.id === id ? { ...p, quantity: q } : p
    ));
  };

  const subtotal = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleGenerateQuote = () => {
    if (!customerInfo.name || selectedProducts.length === 0) {
      toast({ title: "Validation Error", description: "Please add customer name and at least one product.", variant: "destructive" });
      return;
    }
    toast({ title: "Quote Generated", description: "Enterprise quote has been successfully initialized." });
    // Handle submission logic here
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Draft: "bg-slate-100 text-slate-600",
      Sent: "bg-blue-50 text-blue-600",
      Accepted: "bg-green-50 text-[#2E7D32]",
      Rejected: "bg-rose-50 text-rose-600"
    };
    return (
      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] || styles.Draft}`}>
        ● {status}
      </span>
    );
  };

  return (
    <PortalLayout role="admin">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none mb-2">
              Quote <span className="text-[#2E7D32]">Engine</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Commercial Valuation Node v2.0</p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setActiveTab('new')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'new' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Generate New
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Quote History
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'new' ? (
            <motion.div 
              key="new-quote"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              {/* LEFT: CUSTOMER & PRODUCT SELECTOR */}
              <div className="xl:col-span-2 space-y-8">
                {/* CUSTOMER INFO */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                      <User size={18} className="text-[#2E7D32]" />
                      <span className="font-black uppercase tracking-widest text-[11px] text-slate-800 italic">Target Entity Profile</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Proprietor Name"
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-[#2E7D32]/20 transition-all"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Entity/Company</label>
                        <input 
                          type="text" 
                          placeholder="Business Name"
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-[#2E7D32]/20 transition-all"
                          value={customerInfo.company}
                          onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                        />
                      </div>
                   </div>
                </div>

                {/* PRODUCT MATRIX */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={18} className="text-[#2E7D32]" />
                        <span className="font-black uppercase tracking-widest text-[11px] text-slate-800 italic">Inventory Assets</span>
                      </div>
                      <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search Assets..."
                          className="bg-slate-50 rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-tighter outline-none w-48 focus:w-64 transition-all"
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {products.map(prod => (
                        <div 
                          key={prod.id} 
                          onClick={() => addProductToQuote(prod)}
                          className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl hover:border-[#2E7D32] hover:bg-white cursor-pointer group transition-all"
                        >
                           <div className="flex justify-between items-start mb-3">
                              <span className="text-[8px] font-black text-[#2E7D32] bg-green-50 px-2 py-1 rounded-lg uppercase tracking-widest">{prod.category}</span>
                              <Plus size={14} className="text-slate-300 group-hover:text-[#2E7D32] transition-colors" />
                           </div>
                           <h4 className="text-xs font-black text-slate-900 uppercase tracking-tighter mb-1">{prod.name}</h4>
                           <div className="flex justify-between items-center">
                              <p className="text-[11px] font-black text-slate-400">₹{prod.price}</p>
                              <span className="text-[9px] font-bold text-slate-300 italic group-hover:text-slate-500 transition-colors">Stock: {prod.stock}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* RIGHT: QUOTE SUMMARY */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[3rem] border-2 border-[#2E7D32]/10 shadow-xl relative overflow-hidden flex flex-col h-full sticky top-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-12 h-12 bg-[#2E7D32] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                        <FileText className="text-white" size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-widest text-[11px] text-slate-900 italic">Financial Summary</span>
                        <span className="text-[8px] font-black text-[#2E7D32] uppercase tracking-[0.2em]">Live Price Engine</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedProducts.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-slate-300 space-y-3 grayscale opacity-50">
                          <ShoppingBag size={48} strokeWidth={1} />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Node Empty</p>
                        </div>
                      ) : (
                        selectedProducts.map(item => (
                          <div key={item.id} className="group p-4 bg-slate-50 rounded-2xl space-y-3">
                            <div className="flex justify-between items-start">
                              <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-tighter w-2/3">{item.name}</h5>
                              <button onClick={() => removeProduct(item.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2 rounded-xl">
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded-lg text-xs font-black">-</button>
                                <span className="text-[10px] font-black w-8 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded-lg text-xs font-black">+</button>
                              </div>
                              <span className="text-[10px] font-black text-[#2E7D32]">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-8 mt-8 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>GST (18%)</span>
                        <span>₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 text-xl font-black text-slate-900 italic tracking-tighter">
                        <span className="uppercase text-[11px] font-black not-italic text-slate-400 tracking-widest">Total Valuation</span>
                        <div className="flex flex-col items-end">
                          <span>₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                       <button 
                        onClick={() => window.print()} 
                        className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                       >
                         <Printer size={14} /> Print
                       </button>
                       <button 
                        onClick={handleGenerateQuote}
                        className="py-4 bg-[#2E7D32] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-900/10"
                       >
                         <Send size={14} /> Finalize
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
               <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="px-10 py-8">Identity ID</th>
                      <th className="px-10 py-8">Entity Name</th>
                      <th className="px-10 py-8">Timestamp</th>
                      <th className="px-10 py-8">Valuation</th>
                      <th className="px-10 py-8">Status Pulse</th>
                      <th className="px-10 py-8 text-right">Synchronization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {quotes.map((q, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6 text-[11px] font-black text-slate-900 italic">{q.id}</td>
                        <td className="px-10 py-6 text-[11px] font-bold text-slate-600 uppercase italic transition-colors group-hover:text-[#2E7D32]">{q.customer}</td>
                        <td className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">{q.date}</td>
                        <td className="px-10 py-6 text-[11px] font-black text-slate-900 tracking-tighter">₹{q.amount.toLocaleString()}</td>
                        <td className="px-10 py-6">
                           <StatusBadge status={q.status} />
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Download size={14}/></button>
                              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-[#2E7D32] hover:text-white transition-all"><Share2 size={14}/></button>
                              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all"><Trash2 size={14}/></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2E7D32;
        }
      `}</style>
    </PortalLayout>
  );
};

export default QuoteEngine;
