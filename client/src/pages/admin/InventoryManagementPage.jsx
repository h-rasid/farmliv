import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Package, AlertTriangle, TrendingDown, 
  Search, Filter, Plus, Edit3, Trash2, 
  Truck, Archive, ArrowRightLeft, Layers, X, Loader2,
  Image as ImageIcon, Video
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InventoryManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [protocolData, setProtocolData] = useState(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [isBatchAuditOpen, setIsBatchAuditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', stock: 0, hsn: '8414', status: 'Active'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Inventory Sync Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleProtocol = async (productId, currentStock, action) => {
    try {
      if (adjustmentAmount <= 0) return;
      await API.patch(`/products/${productId}/stock`, { amount: adjustmentAmount, action });
      
      // Optimistic Update for Offline Mode
      const adjustment = action === 'add' ? adjustmentAmount : -adjustmentAmount;
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + adjustment) } : p
      ));

      toast({ title: "Inventory Calibrated", description: `Volume ${action === 'add' ? 'increased' : 'decreased'} successfully.` });
      setProtocolData(null);
      setAdjustmentAmount(0);
    } catch (err) {
      toast({ variant: "destructive", title: "Protocol Calibration Failed" });
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStock === 'Low') return matchesSearch && p.stock <= 10;
    if (filterStock === 'Out') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  return (
    <PortalLayout role="admin">
      <div className="max-w-[1450px] mx-auto p-6 md:p-10 space-y-8 font-sans text-slate-900">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Inventory Control</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">Supply Chain Monitoring</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsBatchAuditOpen(true)}
              className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
            >
              <Archive size={16} /> Batch Audit
            </button>
            <button 
              onClick={() => {
                setFormData({ name: '', category: '', stock: 0, hsn: '8414', status: 'Active' });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-black/10"
            >
              <Plus size={16} /> Add Stock Unit
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Quick Action Filters */}
           {['All', 'Low', 'Out'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterStock(type)}
                className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                  filterStock === type ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col items-start">
                   <span className="text-[10px] font-black uppercase tracking-widest">{type} Inventory</span>
                   <span className="text-xl font-black tracking-tighter">
                     {type === 'All' ? products.length : products.filter(p => type === 'Low' ? p.stock <= 10 : p.stock === 0).length}
                   </span>
                </div>
                <div className={`p-2 rounded-xl ${filterStock === type ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                   {type === 'All' ? <Layers size={18}/> : type === 'Low' ? <AlertTriangle size={18} className="text-amber-500"/> : <TrendingDown size={18} className="text-rose-500"/>}
                </div>
              </button>
           ))}
           <div className="relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
             <input 
                type="text" 
                placeholder="Search Identity..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 h-full bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
             />
           </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                  <th className="py-6 px-8">Product Profile</th>
                  <th className="py-6 px-4">Classification</th>
                  <th className="py-6 px-4 text-center">Current Vol..</th>
                  <th className="py-6 px-4">Threshold status</th>
                  <th className="py-6 px-4">Warehouse</th>
                  <th className="py-6 px-8 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="py-6 px-8">
                       <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{prod.name}</span>
                       <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">HSN: {prod.hsn || '8414'}</p>
                    </td>
                    <td className="py-6 px-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{prod.category}</span>
                    </td>
                    <td className="py-6 px-4">
                       <div className="flex justify-center flex-col items-center">
                          <span className="text-sm font-black text-slate-900">{prod.stock}</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Units Active</span>
                       </div>
                    </td>
                    <td className="py-6 px-4">
                       <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                         prod.stock === 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                         prod.stock <= 10 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                         'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                         {prod.stock === 0 ? 'Critical Out' : prod.stock <= 10 ? 'Low Stock' : 'Synchronized'}
                       </div>
                    </td>
                    <td className="py-6 px-4">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Truck size={12} className="text-slate-200" /> HQ Warehouse
                       </div>
                    </td>
                     <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => setProtocolData({ id: prod.id, name: prod.name, stock: prod.stock })}
                             className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group/btn"
                             title="Inventory Protocol"
                           >
                              <ArrowRightLeft size={16} className="group-hover/btn:rotate-180 transition-all duration-500" />
                           </button>
                           <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                              <Edit3 size={16} />
                           </button>
                        </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Database size={40} className="mx-auto text-slate-100 mb-4" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No Synchronized Inventory Items Found</p>
            </div>
          )}
        </div>

        {/* --- MODALS & DIALOGS --- */}
        <AnimatePresence>
          {/* Protocol Calibration Dialog */}
          {protocolData && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100"
              >
                <div className="mb-8">
                   <h2 className="text-xl font-black italic uppercase tracking-tighter">Inventory Protocol</h2>
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Calibrating: {protocolData.name}</p>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400">Current Volume</span>
                      <span className="text-2xl font-black tracking-tighter text-slate-900 italic">{protocolData.stock} UNITS</span>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Adjustment Volume</label>
                      <input 
                        type="number" 
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                        className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-xl font-black italic outline-none focus:ring-4 ring-indigo-500/10 transition-all"
                        placeholder="0"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleProtocol(protocolData.id, protocolData.stock, 'add')}
                        className="py-5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                         Increment Vol.
                      </button>
                      <button 
                        onClick={() => handleProtocol(protocolData.id, protocolData.stock, 'remove')}
                        className="py-5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                      >
                         Decrement Vol.
                      </button>
                   </div>

                   <button 
                     onClick={() => setProtocolData(null)}
                     className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                   >
                     Cancel Protocol
                   </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Batch Audit Summary */}
          {isBatchAuditOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter">Enterprise Batch Audit</h2>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Enterprise Supply Chain Verification</p>
                   </div>
                   <button onClick={() => setIsBatchAuditOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><X size={20}/></button>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-12">
                   <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex flex-col gap-2">
                      <Layers size={20} className="text-indigo-500" />
                      <span className="text-[24px] font-black tracking-tighter italic text-indigo-700">{products.length}</span>
                      <span className="text-[9px] font-black uppercase text-indigo-400">Total Items</span>
                   </div>
                   <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex flex-col gap-2">
                      <Package size={20} className="text-emerald-500" />
                      <span className="text-[24px] font-black tracking-tighter italic text-emerald-700">{products.reduce((acc, p) => acc + p.stock, 0)}</span>
                      <span className="text-[9px] font-black uppercase text-emerald-400">Total Volume</span>
                   </div>
                   <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 flex flex-col gap-2">
                      <AlertTriangle size={20} className="text-amber-500" />
                      <span className="text-[24px] font-black tracking-tighter italic text-amber-700">{products.filter(p => p.stock <= 10).length}</span>
                      <span className="text-[9px] font-black uppercase text-amber-400">Risk Alerts</span>
                   </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2rem] text-center space-y-4">
                   <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"Batch Audit Protocol automatically synchronizes physical inventory counts across all HQ Warehouse sectors. This action will be logged in the Enterprise Ledger."</p>
                   <button 
                     onClick={() => {
                       toast({ title: "Audit Synchronized", description: "All inventory units have been verified." });
                       setIsBatchAuditOpen(false);
                     }}
                     className="px-10 py-5 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95"
                   >
                     Proceed with Full Audit
                   </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Add Stock Unit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">New Stock Unit</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Initialize Inventory Item</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400"><X size={24}/></button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const data = new FormData();
                    Object.keys(formData).forEach(key => data.append(key, formData[key]));
                    
                    const res = await API.post('/products', data);
                    
                    // Optimistic Update for Offline Mode
                    const newAsset = {
                      id: res.data.id || Date.now(),
                      ...formData,
                      images: []
                    };
                    setProducts(prev => [newAsset, ...prev]);

                    toast({ title: "Stock Unit Deployed", description: "Product has been synchronized with the HQ Warehouse." });
                    setIsModalOpen(false);
                  } catch (err) {
                    toast({ variant: "destructive", title: "Deployment Failed" });
                  }
                }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Item Identity</label>
                       <input 
                         type="text" 
                         placeholder="E.g. Plastic Crate XT" 
                         className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 ring-emerald-500/10 transition-all" 
                         value={formData.name} 
                         onChange={(e) => setFormData({...formData, name: e.target.value})} 
                         required 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Classification</label>
                       <select 
                         className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none appearance-none cursor-pointer" 
                         value={formData.category} 
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                         required
                       >
                         <option value="">Select Category</option>
                         <option value="Seeds">Seeds</option>
                         <option value="Fertilizers">Fertilizers</option>
                         <option value="Pesticides">Pesticides</option>
                         <option value="Mulch Film">Mulch Film</option>
                         <option value="Equipment">Equipment</option>
                       </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Initial Volume</label>
                       <input 
                         type="number" 
                         placeholder="0" 
                         className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none" 
                         value={formData.stock} 
                         onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black text-slate-400 ml-1">HSN Protocol</label>
                       <input 
                         type="text" 
                         placeholder="8414" 
                         className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none" 
                         value={formData.hsn} 
                         onChange={(e) => setFormData({...formData, hsn: e.target.value})} 
                       />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 transition-all active:scale-[0.98]">
                      Confirm Deployment
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PortalLayout>
  );
};

export default InventoryManagementPage;
