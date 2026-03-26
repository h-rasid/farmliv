import React, { useState, useEffect } from 'react';

import { m as motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Shield, LogOut, 
  ChevronRight, Camera, Bell, Key, Info,
  ShieldCheck, Globe, Star, Activity, 
  Target, Zap, Award, Settings,
  Lock, BellOff, Fingerprint, Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('identity');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('farmliv_salesman');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('farmliv_salesman');
    toast({ title: "Session Disconnected", description: "Node credentials cleared from local cache." });
    navigate('/salesman/login');
  };

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col gap-10 max-w-5xl mx-auto">
        
        {/* COMMAND CENTER HEADER */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                 <div className="w-40 h-40 rounded-[3.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border-4 border-white/20 shadow-2xl">
                    <User size={80} strokeWidth={1} />
                 </div>
                 <button className="absolute -bottom-2 -right-2 p-4 bg-emerald-500 text-white rounded-[1.5rem] shadow-xl hover:scale-110 active:scale-95 transition-all">
                    <Camera size={20} />
                 </button>
              </div>
              
              <div className="flex flex-col text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                       Primary Node
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Verified Rep</span>
                    </div>
                 </div>
                 <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">{user.name}</h1>
                 <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Field Strategic Representative • Sector ID-{user.id}</p>
              </div>

              <div className="ml-auto flex items-center gap-4">
                 <div className="hidden lg:flex flex-col items-end">
                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Operational Status</span>
                    <span className="text-emerald-400 text-sm font-black italic uppercase">Node Active</span>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500">
                    <Activity size={20} />
                 </div>
              </div>
           </div>
        </div>

        {/* SETTINGS MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* SIDEBAR TABS */}
           <div className="flex flex-col gap-3">
              {[
                 { id: 'identity', icon: Fingerprint, label: 'Identity Matrix' },
                 { id: 'security', icon: Lock, label: 'Protocols' },
                 { id: 'alerts', icon: Bell, label: 'Alert Grid' },
                 { id: 'stats', icon: Cpu, label: 'Node Hardware' }
              ].map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 p-6 rounded-[2rem] transition-all border ${activeTab === tab.id ? 'bg-white border-slate-100 shadow-xl text-slate-900' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'}`}
                 >
                    <tab.icon size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                 </button>
              ))}
              
              <button 
                 onClick={handleLogout}
                 className="mt-6 flex items-center gap-4 p-6 rounded-[2rem] bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
              >
                 <LogOut size={20} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Disconnect Session</span>
              </button>
           </div>

           {/* CONTENT AREA */}
           <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                 {activeTab === 'identity' && (
                    <motion.div 
                       initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                       className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 space-y-10"
                    >
                       <div className="flex justify-between items-center">
                          <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Entity Details</h3>
                          <button className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl">Update Node</button>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 text-slate-300">
                                <Mail size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Primary Email Inflow</span>
                             </div>
                             <p className="text-sm font-bold text-slate-900 pl-6">{user.email}</p>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 text-slate-300">
                                <Phone size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Direct Logic Line</span>
                             </div>
                             <p className="text-sm font-bold text-slate-900 pl-6">{user.phone || 'Vector Not Defined'}</p>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 text-slate-300">
                                <Award size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Security Clearance</span>
                             </div>
                             <p className="text-sm font-bold text-slate-900 pl-6 uppercase tracking-tighter">Level 2 Field Admin</p>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 text-slate-300">
                                <MapPin size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Sector Base</span>
                             </div>
                             <p className="text-sm font-bold text-slate-900 pl-6 uppercase tracking-tighter italic">Regional Hub (India)</p>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {activeTab === 'security' && (
                    <motion.div 
                       initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                       className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 space-y-8"
                    >
                       <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Security Protocols</h3>
                       <div className="space-y-4">
                          {[
                             { icon: Key, label: 'Access Credential Reset', desc: 'Sync new authentication password' },
                             { icon: Shield, label: 'Two-Factor Engagement', desc: 'Add secondary node verification' },
                             { icon: Globe, label: 'Session Management', desc: 'View all active terminal points' }
                          ].map((item, i) => (
                             <button key={i} className="w-full p-6 bg-slate-50 hover:bg-slate-100 rounded-[2rem] border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-6 text-left">
                                   <div className="p-3 bg-white rounded-2xl text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                                      <item.icon size={20} />
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{item.label}</span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mt-1">{item.desc}</span>
                                   </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-400 transition-all" />
                             </button>
                          ))}
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* SYSTEM FOOTER */}
        <div className="text-center py-10 opacity-30">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 text-slate-400">
              <ShieldCheck size={12}/> Secure Protocol v2.4.0 • Node: TR-891
           </p>
        </div>

      </div>
    </>
  );
};
export default ProfileSettings;

