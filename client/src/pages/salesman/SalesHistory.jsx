import React, { useState, useEffect } from 'react';
import PortalLayout from '../../layouts/PortalLayout';
import API from '@/utils/axios';
import { motion } from 'framer-motion';
import { 
  Receipt, Calendar, User, IndianRupee, 
  Package, History, Search, Filter 
} from 'lucide-react';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('farmliv_salesman'));

  useEffect(() => {
    if (user?.id) fetchSalesHistory();
  }, [user?.id]);

  const fetchSalesHistory = async () => {
    try {
      const cleanId = user.id.toString().split(':')[0];
      const res = await API.get(`/sales/salesman/${cleanId}`);
      setSales(res.data);
    } catch (err) {
      console.error("History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout role="salesman">
      <div className="max-w-[1600px] mx-auto p-8 space-y-12 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Sales <span className="text-emerald-600">History</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Executive Accomplishments Hub</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
             <History className="text-emerald-600" size={20} />
             <span className="text-sm font-black text-gray-900 uppercase italic">Total Conversions: {sales.length}</span>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction ID</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Client</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Valuation</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Protocol</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <Receipt size={16} />
                        </div>
                        <span className="text-[11px] font-black text-gray-900 tracking-wider">TRX-{sale.id.toString().padStart(6, '0')}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm font-black text-gray-800 uppercase italic">{sale.customer_name}</span>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-bold text-gray-500 uppercase">{sale.product_name}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-1 text-emerald-600 font-black italic text-lg">
                        <IndianRupee size={16} /> {parseFloat(sale.final_price).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-4 py-2 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-[10px] font-bold text-gray-400">
                      {new Date(sale.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sales.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-300 uppercase text-[10px] font-black tracking-widest">
              No transactions recorded in history
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default SalesHistory;
