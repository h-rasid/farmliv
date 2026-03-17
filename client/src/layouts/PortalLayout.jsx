import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API from '@/utils/axios';
import { 
  LayoutDashboard, Package, Users, LogOut, 
  Menu, X, Bell, User as UserIcon, Settings, Layers,
  BarChart, BarChart3, MessageSquare, FileText, History, HelpCircle,
  Database, TrendingUp, ShoppingBag, Boxes, UserCircle,
  Target, ShoppingCart, CreditCard, CheckCircle2, MapPin,
  ChevronRight, ChevronDown, Calculator, Megaphone, ShieldCheck, 
  ScrollText, UserCog, Mail, MessageCircle, Zap, AlertCircle,
  Activity, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PortalLayout = ({ children, role = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // CRM Badge State
  const [crmBadges, setCrmBadges] = useState({ leads: 0, enquiries: 0 });

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      if (role === 'admin') {
        const [activitiesRes, statsRes, leadsRes, quickEnqRes] = await Promise.all([
          API.get('admin/activities'),
          API.get('admin/stats'),
          API.get('leads'),
          API.get('quick-enquiries')
        ]);

        // Update CRM Badges from stats
        if (statsRes.data) {
          setCrmBadges({
            leads: statsRes.data.pendingLeadsCount || 0,
            enquiries: statsRes.data.pendingEnquiriesCount || 0
          });
        }

        const alerts = [];
        if (statsRes.data?.lowStockAlerts > 0) {
          alerts.push({
            id: 'stock-alert',
            type: 'alert',
            title: 'Low Stock Detected',
            message: `There are ${statsRes.data.lowStockAlerts} products with critically low stock levels.`,
            time: 'Action Required',
            icon: AlertCircle,
            color: 'text-rose-500',
            bg: 'bg-rose-50',
            path: '/admin/inventory'
          });
        }

        const recentLeads = Array.isArray(leadsRes.data) ? leadsRes.data.slice(0, 5) : [];
        recentLeads.forEach(lead => {
          alerts.push({
            id: `lead-${lead.id}`,
            rawId: lead.id,
            type: 'lead',
            is_seen: lead.is_seen,
            title: 'New Quote Request',
            message: `${lead.customer_name || 'Individual Prospect'} requested a quote.`,
            time: new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: Calculator,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            path: '/admin/leads'
          });
        });

        const recentEnq = Array.isArray(quickEnqRes.data) ? quickEnqRes.data.slice(0, 5) : [];
        recentEnq.forEach(enq => {
          alerts.push({
            id: `enq-${enq.id}`,
            rawId: enq.id,
            type: 'enquiry',
            is_seen: enq.is_seen,
            title: 'New Quick Enquiry',
            message: `${enq.customer_name || 'Unknown Prospect'} sent a new enquiry from ${enq.location || 'N/A'}.`,
            time: new Date(enq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: Zap,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            path: '/admin/quick-enquiries'
          });
        });

        const recentLogs = Array.isArray(activitiesRes.data) ? activitiesRes.data.slice(0, 5) : [];
        recentLogs.forEach((log, index) => {
          alerts.push({
            id: `act-${index}-${Date.now()}`,
            type: 'activity',
            title: log.user || 'System',
            message: log.action,
            time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: History,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
          });
        });
        setNotifications(alerts);
      } else if (role === 'salesman') {
        const userStr = localStorage.getItem('farmliv_salesman');
        if (!userStr) return;
        const salesman = JSON.parse(userStr);

        const [leadsRes, statsRes] = await Promise.all([
          API.get(`/salesman/${salesman.id}/leads`),
          API.get(`/salesman/${salesman.id}/dashboard-stats`)
        ]);

        const alerts = [];
        const leadsData = Array.isArray(leadsRes.data) ? leadsRes.data : [];
        const pendingLeads = leadsData.filter(l => l.status === 'assigned').slice(0, 5);
        pendingLeads.forEach(lead => {
          alerts.push({
            id: `lead-${lead.id}`,
            type: 'lead',
            title: 'New Lead Assigned',
            message: `You have been assigned to ${lead.customer_name}.`,
            time: 'Recently',
            icon: Target,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            path: '/salesman/leads'
          });
        });
        setNotifications(alerts);
      }
    } catch (err) {
      console.warn("Notification sync delayed:", err.message);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Increased polling to 5s for realtime
    return () => clearInterval(interval);
  }, [role]);

  const markAllSeen = async () => {
    try {
      // Optimistically clear badges in UI
      setCrmBadges({ leads: 0, enquiries: 0 });
      // Call backend to mark both as seen
      await Promise.all([
        API.post('admin/mark-seen', { type: 'leads' }),
        API.post('admin/mark-seen', { type: 'enquiries' })
      ]);
    } catch (err) {
      console.error("Failed to sync seen status:", err);
    }
  };

  const handleMarkIndividualSeen = async (notif) => {
    if (notif.is_seen === 1) return;
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_seen: 1 } : n));
      
      const type = notif.type === 'lead' ? 'leads' : 'enquiries';
      await API.post('admin/mark-seen', { type, id: notif.rawId });
      
      // Update badge counts locally
      setCrmBadges(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1)
      }));
    } catch (err) {
      console.error("Failed to mark individual notification seen:", err);
    }
  };

  const handleNotifClick = () => {
    setShowNotifPanel(!showNotifPanel);
    // REMOVED: No longer marking all seen on panel open
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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
          id: 'crm', name: 'LEADS', icon: Target, path: '/admin/leads',
          badge: (crmBadges.leads + crmBadges.enquiries) || null,
          submenu: [
            { name: 'Request Quote', path: '/admin/leads', badge: crmBadges.leads || null },
            { name: 'Quick Enquiries', path: '/admin/quick-enquiries', badge: crmBadges.enquiries || null }
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
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/salesman-portal' },
      { id: 'leads', name: 'Leads', icon: Target, path: '/salesman/leads', badge: notifications.length > 0 ? notifications.length : null },
      { id: 'enquiries', name: 'Enquiries', icon: MessageSquare, path: '/salesman/enquiries' },
      { id: 'customers', name: 'Customers', icon: Users, path: '/salesman/customers' },
      { id: 'catalog', name: 'Product Catalog', icon: Package, path: '/salesman/catalog' },
      { id: 'orders', name: 'Orders', icon: ShoppingBag, path: '/salesman/history' },
      { id: 'new-order', name: 'New Order', icon: ShoppingCart, path: '/salesman/new-order' },
      { id: 'visits', name: 'Visit Log', icon: MapPin, path: '/salesman/visits' },
      { id: 'payments', name: 'Payments', icon: CreditCard, path: '/salesman/payments' },
      { id: 'tasks', name: 'Tasks', icon: Activity, path: '/salesman/tasks' },
      { id: 'reports', name: 'Reports', icon: BarChart3, path: '/salesman/reports' },
      { id: 'profile', name: 'My Farmliv', icon: UserCircle, path: '/salesman/profile' },
    ];
  };

  const navLinks = getLinks();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Disconnect your Farmliv session?")) {
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
                  <span className="text-[8px] font-black text-green-300 uppercase tracking-[0.4em]">{role === 'admin' ? 'Admin Hub' : 'Field Operations'}</span>
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
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full gap-2 min-w-[140px]">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black min-w-[18px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
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
        
        {/* PREMIUM FARMLIV HEADER */}
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
                <div className="relative cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <MessageCircle size={20} className="text-slate-400 group-hover:text-[#134E4A] transition-colors" />
                </div>
               <div className="relative cursor-pointer group">
                  <Mail size={20} className="text-slate-400 group-hover:text-[#134E4A] transition-colors" />
               </div>
              <div className="relative" ref={notifRef}>
                <div 
                  onClick={handleNotifClick}
                  className="relative cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <Bell size={20} className={`text-slate-400 group-hover:text-[#134E4A] transition-colors ${(crmBadges.leads + crmBadges.enquiries) > 0 ? 'animate-pulse' : ''}`} />
                  {(crmBadges.leads + crmBadges.enquiries) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">
                      {crmBadges.leads + crmBadges.enquiries}
                    </span>
                  )}
                </div>

                {/* NOTIFICATION PANEL */}
                <AnimatePresence>
                  {showNotifPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-[100] overflow-hidden"
                    >
                      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-2">
                            <Bell size={14} className="text-[#2E7D32]" /> System Directives
                          </span>
                          {(crmBadges.leads + crmBadges.enquiries) > 0 && (
                            <span className="text-[8px] font-bold text-[#2E7D32] uppercase tracking-tighter mt-1">
                              {crmBadges.leads + crmBadges.enquiries} UNREAD TASKS
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {(crmBadges.leads + crmBadges.enquiries) > 0 && (
                            <button 
                              onClick={markAllSeen}
                              className="text-[8px] font-black text-[#2E7D32] uppercase tracking-widest hover:underline"
                            >
                              Mark All
                            </button>
                          )}
                          <button 
                            onClick={() => setShowNotifPanel(false)}
                            className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-2">
                        {notifLoading ? (
                          <div className="p-12 flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Pulse...</span>
                          </div>
                        ) : notifications.length > 0 ? (
                          <div className="space-y-1">
                            {notifications.map((notif) => (
                                <div 
                                  key={notif.id}
                                  onClick={() => {
                                    if (notif.type !== 'activity') {
                                      handleMarkIndividualSeen(notif);
                                    }
                                    if (notif.path) {
                                      navigate(notif.path);
                                      setShowNotifPanel(false);
                                    }
                                  }}
                                  className={`group flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 ${notif.is_seen === 0 ? 'bg-emerald-50/40 hover:bg-emerald-100/40 relative' : 'hover:bg-slate-50'}`}
                                >
                                  {notif.is_seen === 0 && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                  )}
                                <div className={`p-3 rounded-xl ${notif.bg} ${notif.color} group-hover:scale-110 transition-transform`}>
                                  <notif.icon size={16} />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{notif.title}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{notif.time}</span>
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic line-clamp-2">
                                    {notif.message}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-16 flex flex-col items-center text-center gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-slate-200">
                               <ShieldCheck size={40} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Farmliv Protected</span>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No active alerts detected</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="p-4 border-t border-slate-50 text-center">
                          <button 
                            onClick={() => setNotifications([])}
                            className="text-[9px] font-black text-[#2E7D32] uppercase tracking-[0.2em] hover:opacity-70 transition-all"
                          >
                            Dismiss All Protocols
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
