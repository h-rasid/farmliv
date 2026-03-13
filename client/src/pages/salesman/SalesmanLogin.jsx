import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/utils/axios';
import { Loader2, Lock, Mail, ShieldCheck, HelpCircle, Zap } from 'lucide-react';
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
          setError("ADMIN IDENTITY DETECTED: PLEASE USE THE ADMIN PORTAL.");
          setLoading(false);
          return;
        }

        if (user?.status === 'inactive') {
          setError("ACCOUNT DEACTIVATED: CONTACT FARMLIV ADMIN.");
          setLoading(false);
          return;
        }

        localStorage.setItem('farmliv_user', JSON.stringify(user));
        navigate('/salesman-portal');
        toast({ title: "Authorized", description: `Authorized Connection established.` });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("IDENTITY NOT FOUND");
      } else {
        setError("AUTHENTICATION FAILED");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-gray-50 relative overflow-hidden">
        
        {/* Sales Branding - Premium White Theme */}
        <div className="text-center mb-10 relative z-10">
          <div className="text-3xl font-black text-[#2E7D32] tracking-tighter mb-2 italic uppercase">FARMLIV</div>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">
            <Zap className="w-3 h-3 text-[#2E7D32]" /> Secure Salesman Portal
          </div>
        </div>

        {error && (
          <div className="mb-6 p-5 bg-red-50 text-red-600 text-[9px] font-black rounded-2xl text-center uppercase tracking-widest border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest leading-none">Identity Mail</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="email" 
                placeholder="sales@farmliv.com"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-sm focus:border-[#2E7D32]/20 focus:bg-white outline-none transition-all font-bold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest leading-none">Access Token</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-sm focus:border-[#2E7D32]/20 focus:bg-white outline-none transition-all font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[#2E7D32] hover:-translate-y-1 active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Authorize Connection'}
          </button>

          <div className="text-center pt-2 space-y-4">
            <a 
              href="mailto:it-support@farmliv.com?subject=Salesman Access Recovery"
              className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-[#2E7D32] transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle size={12} /> Trouble entering the portal?
            </a>
            <div className="pt-4 border-t border-gray-50">
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">Wrong Portal?</p>
                <button 
                  type="button"
                  onClick={() => navigate('/admin/login')}
                  className="text-[9px] font-black text-[#2E7D32] uppercase tracking-widest hover:underline"
                >
                  Admin Console Login
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesmanLogin;
