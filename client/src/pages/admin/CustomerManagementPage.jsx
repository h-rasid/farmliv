import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, Mail, Phone, MapPin, 
  Building2, Trash2, Edit3, ChevronRight, UserCheck, UserX
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Customer Sync Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await API.put(`/customers/${id}/status`, { status: newStatus });
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast({ title: `Customer ${newStatus.toUpperCase()}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Status Update Failed" });
    }
  };

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || c.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <PortalLayout role="admin">
      <div className="max-w-[1450px] mx-auto p-6 md:p-10 space-y-8 font-sans text-slate-900">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Customer Hub</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">Manage Customer Network</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-green-900/20">
            <UserPlus size={16} /> Add Customer
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, company, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm outline-none cursor-pointer appearance-none shadow-sm font-bold uppercase tracking-widest text-[10px]"
            >
              <option value="All">All Entities</option>
              <option value="Farmer">Farmers</option>
              <option value="Dealer">Dealers</option>
              <option value="Distributor">Distributors</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                  <th className="py-6 px-8 text-center w-20">Status</th>
                  <th className="py-6 px-4">Customer Name</th>
                  <th className="py-6 px-4">Contact Info</th>
                  <th className="py-6 px-4">Location</th>
                  <th className="py-6 px-4 text-center">Type</th>
                  <th className="py-6 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                    <td className="py-6 px-8">
                      <div className="flex justify-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{customer.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Building2 size={10} /> {customer.company || 'Private Entity'}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-2"><Phone size={12} className="text-slate-300"/> {customer.phone}</span>
                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-2"><Mail size={12} className="text-slate-300"/> {customer.email}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        <MapPin size={12} className="text-emerald-500" /> {customer.location || 'Pan-India'}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${
                          customer.type === 'Distributor' ? 'bg-indigo-50 text-indigo-600' :
                          customer.type === 'Dealer' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {customer.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(customer.id, customer.status)}
                          className={`p-3 rounded-2xl transition-all ${customer.status === 'active' ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                        >
                          {customer.status === 'active' ? <UserX size={16}/> : <UserCheck size={16}/>}
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
              <Users size={40} className="mx-auto text-slate-100 mb-4" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No Customers Found</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default CustomerManagementPage;
