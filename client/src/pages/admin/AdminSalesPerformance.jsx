import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package, BarChart3, Download, Clock } from 'lucide-react';

const AdminSalesPerformance = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/sales');
        
        // Defensive Check: Ensure data is an array
        const data = Array.isArray(res.data) ? res.data : [];
        setSalesData(data);

        const revenue = data.reduce((acc, curr) => acc + (parseFloat(curr.final_price || curr.amount) || 0), 0);
        setStats({ 
          totalRevenue: revenue, 
          totalOrders: data.length 
        });
      } catch (err) {
        console.error("Revenue Sync Error:", err);
        setSalesData([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };
    fetchPerformanceData();
  }, []);

  return (
    <>
      <div className="max-w-[1600px] mx-auto space-y-12 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-end border-b pb-10">
          <div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic">
              Sales <span className="text-[#2E7D32]">Performance</span>
            </h1>
          </div>
          <button onClick={() => window.print()} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase">
            Print Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
            <h2 className="text-5xl font-black text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h2>
            <DollarSign className="absolute -bottom-6 -right-6 text-gray-50" size={150} />
          </div>
          <div className="bg-gray-900 p-12 rounded-[3rem] shadow-xl relative overflow-hidden text-white">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Sales</p>
            <h2 className="text-5xl font-black">{stats.totalOrders}</h2>
            <Package className="absolute -bottom-6 -right-6 text-white/5" size={150} />
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
              <tr>
                <th className="px-10 py-6">Customer</th>
                <th className="px-10 py-6">Product</th>
                <th className="px-10 py-6">Amount</th>
                <th className="px-10 py-6">Salesman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {salesData.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-10 py-6 font-bold">{sale.customer_name}</td>
                  <td className="px-10 py-6 text-[#2E7D32] font-black uppercase text-xs">{sale.product_name}</td>
                  <td className="px-10 py-6 font-black">₹{parseFloat(sale.amount).toLocaleString()}</td>
                  <td className="px-10 py-6 text-gray-400 font-bold">{sale.salesperson_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminSalesPerformance;