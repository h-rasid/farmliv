import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, Filter, Truck, Package, 
  MapPin, Clock, CheckCircle2, XCircle, ChevronRight,
  User, IndianRupee, Eye, ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Order Sync Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast({ title: `Order set to ${status}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Protocol Error" });
    }
  };

  const filtered = orders.filter(o => 
    filterStatus === 'All' || o.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <PortalLayout role="admin">
      <div className="max-w-[1450px] mx-auto p-6 md:p-10 space-y-8 font-sans text-slate-900">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Order Matrix</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">Transactional Lifecycle Management</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto max-w-full">
            {['All', 'Pending', 'Approved', 'Shipped', 'Delivered'].map(status => (
              <button 
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterStatus === status ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                  <th className="py-6 px-8">Order Code</th>
                  <th className="py-6 px-4">Client</th>
                  <th className="py-6 px-4">Amount</th>
                  <th className="py-6 px-4">Status Hub</th>
                  <th className="py-6 px-4">Executive</th>
                  <th className="py-6 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-[10px]">
                          #{order.id}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Created</span>
                          <span className="text-[10px] font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{order.customer_name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <MapPin size={10} /> {order.location || 'Assam, India'}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-emerald-600 tracking-tighter">₹{order.total_amount?.toLocaleString()}</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Post-Tax</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'Delivered' ? 'bg-emerald-500' : 
                          order.status === 'Cancelled' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {order.status}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <User size={12} className="text-slate-300" /> {order.salesman_name || 'System Auto'}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="px-3 py-2 bg-slate-50 border-none rounded-xl text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer"
                          value={order.status}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-black/5">
                          <Eye size={16} />
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
              <ShoppingBag size={40} className="mx-auto text-slate-100 mb-4" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No Synchronized Transactions</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default OrderManagementPage;
