import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, LogOut, 
  Menu, X, Bell, User as UserIcon, Settings, Layers,
  BarChart3, MessageSquare, FileText, History, HelpCircle,
  Database, TrendingUp, ShoppingBag, Boxes, UserCircle,
  Target, ShoppingCart, CreditCard, CheckCircle2, MapPin,
  ChevronRight, ChevronDown, Calculator, Megaphone, ShieldCheck, 
  ScrollText, UserCog, Mail, MessageCircle, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PortalLayout = ({ children, role = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const adminEmail = "admin@farmliv.com";
  const sessionKey = role === 'admin' ? 'farmliv_admin' : 'farmliv_salesman';
  const user = JSON.parse(localStorage.getItem(sessionKey)) || { name: 'Super Admin' };

  const dashboardPath = role === 'admin' ? '/admin-portal' : '/salesman-portal';

  const getLinks = () => {
    if (role === 'admin') {
      return [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/admin-portal' },
        { id: 'products', name: 'Product Management', icon: Package, path: '/admin/products' },
        { id: 'categories', name: 'Category Management', icon: Layers, path: '/admin/categories' },
        { 
          id: 'quote', name: 'Quote Engine', icon: Calculator, path: '/admin/quote',
          submenu: [
            { name: 'Generate Quote', path: '/admin/quote/new' },
            { name: 'Quote History', path: '/admin/quote/history' }
          ]
        },
        { 
          id: 'crm', name: 'CRM & Leads', icon: Target, path: '/admin/leads',
          submenu: [
            { name: 'Lead Pipeline', path: '/admin/leads' },
            { name: 'Quick Enquiries', path: '/admin/quick-enquiries' }
          ]
        },
        { id: 'orders', name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
        { 
          id: 'inventory', name: 'Inventory', icon: Boxes, path: '/admin/inventory',
          submenu: [
            { name: 'Stock Status', path: '/admin/inventory' },
            { name: 'Warehouse', path: '/admin/inventory/warehouse' }
          ]
        },
        { id: 'sales', name: 'Sales Management', icon: TrendingUp, path: '/admin/sales-performance' },
        { id: 'customers', name: 'Customers', icon: Users, path: '/admin/customers' },
        { 
          id: 'billing', name: 'Billing & Finance', icon: CreditCard, path: '/admin/billing',
          submenu: [
            { name: 'Invoices', path: '/admin/billing/invoices' },
            { name: 'Payments', path: '/admin/billing/payments' }
          ]
        },
        { 
          id: 'marketing', name: 'Marketing', icon: Megaphone, path: '/admin/marketing',
          submenu: [
            { name: 'Campaigns', path: '/admin/marketing/campaigns' },
            { name: 'Promotions', path: '/admin/marketing/promotions' }
          ]
        },
        { 
          id: 'analytics', name: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports',
          submenu: [
            { name: 'Sales Reports', path: '/admin/reports/sales' },
            { name: 'Inventory Reports', path: '/admin/reports/inventory' }
          ]
        },
        { 
          id: 'staff', name: 'Staff Directory', icon: UserCircle, path: '/admin/staff',
          submenu: [
            { name: 'All Staff', path: '/admin/staff' },
            { name: 'Performance', path: '/admin/staff/performance' }
          ]
        },
        { 
          id: 'roles', name: 'Roles & Permissions', icon: UserCog, path: '/admin/settings/roles',
          submenu: [
            { name: 'Roles', path: '/admin/settings/roles' },
            { name: 'Access Controls', path: '/admin/settings/access' }
          ]
        },
        { 
          id: 'logs', name: 'System Logs', icon: ScrollText, path: '/admin/logs',
          submenu: [
            { name: 'Activity Logs', path: '/admin/logs/activity' },
            { name: 'Security Logs', path: '/admin/logs/security' }
          ]
        },
        { id: 'settings', name: 'Admin Settings', icon: Settings, path: '/admin/settings' },
      ];
    }
    return [
      { id: 'dashboard', name: 'Field Hub', icon: LayoutDashboard, path: '/salesman-portal' },
      { id: 'leads', name: 'My Leads', icon: Target, path: '/salesman/leads' },
      { id: 'enquiries', name: 'Quick Enquiries', icon: Zap, path: '/salesman/enquiries' },
      { id: 'customers', name: 'My Network', icon: Users, path: '/salesman/customers' },
      { id: 'new-order', name: 'New Transaction', icon: ShoppingCart, path: '/salesman/new-order' },
      { id: 'payments', name: 'Collection Hub', icon: CreditCard, path: '/salesman/payments' },
      { id: 'visits', name: 'Visit Log', icon: MapPin, path: '/salesman/visits' },
      { id: 'tasks', name: 'Directives', icon: CheckCircle2, path: '/salesman/tasks' },
      { id: 'reports', name: 'Analytics', icon: BarChart3, path: '/salesman/reports' },
      { id: 'profile', name: 'Security Hub', icon: UserIcon, path: '/salesman/profile' },
    ];
  };

  const navLinks = getLinks();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Disconnect your enterprise session?")) {
      localStorage.removeItem(sessionKey);
      const loginPath = role === 'admin' ? '/admin/login' : '/salesman/login';
      navigate(loginPath);
    }
  };

  const toggleSubmenu = (id) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans overflow-hidden">
      
      {/* --- SIDEBAR ENGINE: BRAND FOREST GREEN --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-24' : 'w-80'} bg-[#1B5E20] transform transition-all duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          
          <div className={`p-8 mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <Link to={dashboardPath} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                   <Database className="text-white" size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
                    Farmliv
                  </span>
                  <span className="text-[8px] font-black text-green-300 uppercase tracking-[0.4em]">Admin Hub</span>
                </div>
              </Link>
            )}
            {isCollapsed && <Database className="text-white" size={32} />}
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.submenu?.some(sub => location.pathname === sub.path));
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.id;

              return (
                <div key={item.id} className="space-y-1">
                  <div
                    onClick={() => hasSubmenu ? toggleSubmenu(item.id) : navigate(item.path)}
                    className={`
                      flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer group
                      ${isActive 
                        ? 'bg-[#2E7D32]/30 text-white border-l-4 border-[#2E7D32] shadow-inner' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-green-300' : 'text-white/60 group-hover:text-white transition-colors'} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && hasSubmenu && (
                      <div className={`transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`}>
                         <ChevronDown size={14} />
                      </div>
                    )}
                  </div>

                  {!isCollapsed && hasSubmenu && isSubmenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="ml-10 space-y-1 overflow-hidden"
                    >
                      {item.submenu.map(sub => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className={`
                            block px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                            ${location.pathname === sub.path ? 'text-green-300' : 'text-white/40 hover:text-white hover:bg-white/5'}
                          `}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/5">
             <button 
               onClick={() => setIsCollapsed(!isCollapsed)}
               className="w-full flex items-center justify-center p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all hidden lg:flex"
             >
                <Menu size={20} />
             </button>
          </div>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* PREMIUM ENTERPRISE HEADER */}
        <header className="h-24 flex-shrink-0 flex items-center justify-between px-10 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-40">
          <div className="flex items-center gap-8">
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-gray-50 rounded-xl text-[#2E7D32]"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex flex-col">
               <h2 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                  {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
               </h2>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Pulse: Sync Active</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* ACTION ICONS HUB */}
            <div className="hidden md:flex items-center gap-6 border-r border-gray-100 pr-8">
               <div className="relative cursor-pointer group">
                  <MessageCircle size={20} className="text-slate-400 group-hover:text-[#134E4A] transition-colors" />
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">5</span>
               </div>
               <div className="relative cursor-pointer group">
                  <Mail size={20} className="text-slate-400 group-hover:text-[#134E4A] transition-colors" />
               </div>
               <div className="relative cursor-pointer group">
                  <Bell size={20} className="text-slate-400 group-hover:text-[#134E4A] transition-colors animation-pulse" />
               </div>
            </div>

            {/* PREMIUM USER PROFILE SECTION */}
            <div className="flex items-center gap-4 pl-4 cursor-pointer group">
               <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">{user.name}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{role === 'admin' ? 'Super Admin' : 'Field Agent'}</span>
               </div>
               <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#134E4A]/5 border border-[#134E4A]/10 flex items-center justify-center overflow-hidden transition-all group-hover:shadow-lg group-hover:scale-105">
                     <UserIcon size={20} className="text-[#134E4A]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
               </div>
               <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>

            <button 
              onClick={handleLogout}
              className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Terminate Session"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* VIEWPORT AREA: HIGH DENSITY CANVAS */}
        <div className="flex-1 overflow-y-auto bg-[#F1F5F9] custom-scrollbar scroll-smooth p-6 md:p-12">
           <AnimatePresence mode="wait">
              <motion.div 
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-[1600px] mx-auto"
              >
                 {children}
              </motion.div>
           </AnimatePresence>
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