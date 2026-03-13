import React, { useState, useEffect } from 'react';
import PortalLayout from '../../layouts/PortalLayout';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Shield, LogOut, 
  ChevronRight, Camera, Bell, Key, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('farmliv_salesman');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('farmliv_salesman');
    toast({ title: "Session Disconnected Successfully" });
    navigate('/salesman/login');
  };

  if (!user) return null;

  return (
    <PortalLayout role="salesman">
      <div className="max-w-md mx-auto p-4 md:p-8 space-y-8 pb-24 font-sans text-slate-900">
        <header className="text-center space-y-4">
           <div className="relative inline-block">
              <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-xl">
                 <User size={40} />
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
                 <Camera size={16} />
              </button>
           </div>
           <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">{user.name}</h1>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Field Representative • ID-{user.id}</p>
           </div>
        </header>

        <section className="space-y-3">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Identity Matrix</h3>
           <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Mail size={16}/></div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Primary Email</span>
                       <span className="text-xs font-black lowercase">{user.email}</span>
                    </div>
                 </div>
                 <ChevronRight size={14} className="text-slate-200" />
              </div>
              <div className="p-6 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Phone size={16}/></div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">Contact Node</span>
                       <span className="text-xs font-black">{user.phone || '+91 Trace Pending'}</span>
                    </div>
                 </div>
                 <ChevronRight size={14} className="text-slate-200" />
              </div>
           </div>
        </section>

        <section className="space-y-3">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Security & Preferences</h3>
           <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <button className="w-full p-6 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Key size={16}/></div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">Authenticate Protocol (Reset)</span>
                 </div>
                 <ChevronRight size={14} className="text-slate-200" />
              </button>
              <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all text-rose-500">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><Bell size={16}/></div>
                    <span className="text-xs font-black uppercase tracking-wider">Mute Grid Alerts</span>
                 </div>
                 <div className="w-10 h-6 bg-slate-100 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                 </div>
              </button>
           </div>
        </section>

        <button 
          onClick={handleLogout}
          className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
        >
          <LogOut size={18} /> Disconnect Session
        </button>

        <div className="text-center">
           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
              <Shield size={10}/> Farmliv Enterprise v2.4.0 Secure
           </p>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ProfileSettings;