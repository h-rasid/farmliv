import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  Users, Search, Phone, Mail, MapPin, 
  Building2, ChevronRight, UserCheck, Star
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SalesCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('farmliv_salesman'));
      const res = await API.get(`/salesman/${user.id}/customers`);
      setCustomers(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Network Sync Failed" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-6 pb-24">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic">My Network</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{customers.length} Synchronized Nodes</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
             <Users size={20} />
          </div>
        </header>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search Network Identity..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm focus:ring-2 ring-emerald-500/20 outline-none shadow-sm transition-all"
          />
        </div>

        <section className="space-y-4">
          {filtered.map(customer => (
            <motion.div 
              key={customer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-6 flex items-center justify-between group active:scale-95 transition-all shadow-sm"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                     <Building2 size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{customer.name}</span>
                     <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <MapPin size={10} /> {customer.location || 'Assam'} • {customer.type}
                     </div>
                  </div>
               </div>
               <ChevronRight size={18} className="text-slate-200 group-hover:text-emerald-500" />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="py-20 text-center">
               <Users size={40} className="mx-auto text-slate-100 mb-4" />
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Node Discovery Failed</p>
            </div>
          )}
        </section>
      </div>
    </PortalLayout>
  );
};

export default SalesCustomersPage;
