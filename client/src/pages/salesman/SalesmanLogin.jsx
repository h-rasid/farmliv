import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/utils/axios';
import { Loader2, Lock, Mail, Zap, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'; 

const SalesmanLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/admin/login', { email, password });
      
      if (response.data.success) {
        const user = response.data.user;
        const userRole = (user?.role || '').toLowerCase();

        if (userRole !== 'salesman') {
          setError("IDENTITY MISMATCH: THIS HUB IS FOR SALES EXECUTIVES ONLY.");
          setLoading(false);
          return;
        }

        if (user?.status === 'inactive') {
          setError("ACCOUNT DEACTIVATED. CONTACT FARMLIV HQ.");
          setLoading(false);
          return;
        }

        localStorage.setItem('farmliv_user', JSON.stringify(user));
        navigate('/salesman-portal');
        toast({ title: "Intelligence Synced", description: `Welcome back, ${user.name}. Pipeline active.` });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("IDENTITY NOT FOUND IN SALES FORCE");
      } else {
        setError("AUTHENTICATION PROTOCOL FAILED");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#1E293B] rounded-[3rem] shadow-2xl p-10 border border-slate-700/50 relative overflow-hidden">
        
        {/* Sales Branding */}
        <div className="text-center mb-12 relative z-10">
          <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-600/30">
            <Zap className="text-emerald-500" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase">Sales <span className="text-emerald-500 text-5xl">Force</span></h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3">Farmliv Executive Hub</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-3xl text-center uppercase tracking-widest border border-rose-500/20 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8 relative z-10 transition-all">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-5 tracking-[0.2em]">Identity Mail</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                placeholder="executive@farmliv.com"
                className="w-full pl-16 pr-8 py-6 bg-[#0F172A] border-2 border-slate-800 rounded-[2rem] text-sm text-white focus:border-emerald-600/50 outline-none transition-all font-bold placeholder:text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-5 tracking-[0.2em]">Access Token</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-16 pr-8 py-6 bg-[#0F172A] border-2 border-slate-800 rounded-[2rem] text-sm text-white focus:border-emerald-600/50 outline-none transition-all font-bold placeholder:text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-8 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-900/40 disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Activate Session'}
          </button>

          <div className="text-center pt-4">
            <a 
              href="mailto:it-support@farmliv.com"
              className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle size={12} /> Contact HQ for Credentials
            </a>
          </div>
        </form>

        {/* Decor */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default SalesmanLogin;
