import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, LogOut, 
  Menu, X, Bell, User as UserIcon, Settings, Layers,
  BarChart3, MessageSquare, FileText 
} from 'lucide-react';

const PortalLayout = ({ children, role = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('farmliv_user')) || { name: 'Farmliv Executive' };

  const dashboardPath = role === 'admin' ? '/admin-portal' : '/salesman-portal';

  const menuItems = role === 'admin' ? [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin-portal' },
    { name: 'Product Management', icon: Package, path: '/admin/products' },
    { name: 'Category Management', icon: Layers, path: '/admin/categories' },
    { name: 'Quote Engine', icon: FileText, path: '/admin/leads' }, 
    { name: 'Inquiry Hub', icon: MessageSquare, path: '/admin/quick-enquiries' }, 
    { name: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
    { name: 'Staff Directory', icon: Users, path: '/admin/staff' },
    { name: 'Node Settings', icon: Settings, path: '/admin/settings' }
  ] : [
    { name: 'Sales Pipeline', icon: LayoutDashboard, path: '/salesman-portal' },
    { name: 'My Performance', icon: Settings, path: '/salesman/profile' }
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Disconnect your enterprise session?")) {
      localStorage.removeItem('farmliv_user');
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans overflow-hidden">
      
      {/* --- SIDEBAR ENGINE --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-10 overflow-y-auto custom-scrollbar">
          
          <div className="mb-16">
            <Link to={dashboardPath} className="flex flex-col group">
              <span className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase group-hover:text-farmliv-green transition-colors">
                Farmliv
              </span>
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.6em] mt-1 ml-1">Admin Portal</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300
                    ${isActive 
                      ? 'bg-farmliv-green text-white shadow-farmliv-shadow scale-105' 
                      : 'text-gray-400 hover:bg-farmliv-light hover:text-farmliv-green'}
                  `}
                >
                  <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* ⭐ ONLY ONE DISCONNECT BUTTON AT THE VERY BOTTOM ⭐ */}
          <div className="mt-10 pt-10 border-t border-gray-50">
            <div className="bg-gray-50 rounded-[2.5rem] p-6 flex items-center gap-4 border border-gray-100 mb-6">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <UserIcon className="text-farmliv-green" size={20} />
               </div>
               <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-black uppercase text-gray-900 truncate">{user.name}</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{role} Access</span>
               </div>
            </div>
            
            <button 
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[9px] font-black uppercase text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all tracking-[0.2em] shadow-sm border border-red-100/50 group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Disconnect Session
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* REFINED HEADER: No Search, No extra logout, No bell button */}
        <header className="h-28 flex-shrink-0 flex items-center justify-between px-12 bg-white/70 backdrop-blur-xl border-b border-gray-50 z-40">
          <div className="flex items-center gap-6">
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-4 bg-gray-50 rounded-2xl text-gray-900"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden lg:block">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Environment: <span className="text-farmliv-green">Active</span></span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-black uppercase text-[9px] tracking-[0.2em] shadow-xl hover:bg-farmliv-green transition-all cursor-default">
                <div className="w-2 h-2 rounded-full bg-farmliv-green animate-pulse" />
                Live Sync Active
            </div>
          </div>
        </header>

        {/* VIEWPORT AREA */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAFA] custom-scrollbar scroll-smooth p-6 md:p-10">
           <div className="max-w-[1600px] mx-auto">
              {children}
           </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default PortalLayout;