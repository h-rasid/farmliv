import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Phone, Mail, ChevronDown, Leaf, Award, 
  ArrowRight, Home, Users, Sprout, FileCheck, FileText,
  Truck, Shield, Sparkles, Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productCategories } from '@/data/products';
import { throttle } from '@/utils/performance';
import LazyImage from '@/components/ui/LazyImage';

// --- Components ---

const MenuToggle = ({ toggle, isOpen }) => (
  <button 
    onClick={toggle}
    className="relative z-[70] w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-900">
      <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 4 6 L 20 6" },
          open: { d: "M 6 18 L 18 6" }
        }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        d="M 4 12 L 20 12"
        variants={{
          closed: { opacity: 1, x: 0 },
          open: { opacity: 0, x: -10 }
        }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.2 }}
      />
      <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 4 18 L 20 18" },
          open: { d: "M 6 6 L 18 6" }
        }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </svg>
  </button>
);

const DesktopMenu = memo(({ isProductsOpen, setIsProductsOpen, location }) => {
  const handlePageMove = () => {
    setIsProductsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hidden lg:flex items-center gap-8">
      {['/', '/about'].map(path => (
        <Link 
          key={path} 
          to={path} 
          onClick={() => window.scrollTo(0, 0)}
          className={`relative group font-medium text-[15px] tracking-wide transition-colors ${
            location.pathname === path ? 'text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          {path === '/' ? 'Home' : 'About Us'}
          <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#2E7D32] rounded-full transition-all duration-300 ease-out group-hover:w-full ${location.pathname === path ? 'w-full' : 'w-0'}`}></span>
        </Link>
      ))}
      
      <div 
        className="relative group h-full flex items-center" 
        onMouseEnter={() => setIsProductsOpen(true)} 
        onMouseLeave={() => setIsProductsOpen(false)}
      >
        <Link 
          to="/products" 
          className={`flex items-center gap-1 font-medium text-[15px] tracking-wide transition-colors py-4 ${
            location.pathname.includes('/products') ? 'text-[#2E7D32]' : 'text-gray-700 group-hover:text-[#2E7D32]'
          }`}
          onClick={handlePageMove}
        >
          Products
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </Link>
        <span className={`absolute bottom-2 left-0 h-0.5 bg-[#2E7D32] rounded-full transition-all duration-300 ease-out ${isProductsOpen || location.pathname.includes('/products') ? 'w-full' : 'w-0'}`}></span>
        
        <AnimatePresence>
          {isProductsOpen && (
            <>
              {/* Background Overlay to prevent distraction */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-40 pointer-events-none"
              />

              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.98 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 15, scale: 0.98 }} 
                transition={{ duration: 0.2, ease: "easeOut" }} 
                /* ⭐ OPTIMIZED: fixed position with left/right-0 and mx-auto for perfect centering on all screens */
                className="fixed top-[105px] left-0 right-0 mx-auto w-[94vw] max-w-7xl bg-white/95 backdrop-blur-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] rounded-[2.5rem] overflow-hidden border border-white/40 z-50 ring-1 ring-black/5"
              >
                <div className="p-8 lg:p-12">
                  <div className="grid grid-cols-12 gap-10">
                    {/* LEFT: Category Grid */}
                    <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                      {productCategories.map(category => (
                        <Link 
                          key={category.id} 
                          to={`/products/${category.id}`} 
                          className="group/item flex gap-6 p-4 rounded-3xl hover:bg-[#2E7D32]/5 transition-all duration-300" 
                          onClick={handlePageMove}
                        >
                          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm group-hover/item:shadow-md transition-all border border-gray-100 bg-white">
                            <LazyImage src={category.image} alt={category.name} className="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="font-bold text-gray-900 group-hover/item:text-[#2E7D32] transition-colors font-['Playfair_Display'] text-base lg:text-lg">
                              {category.name}
                            </h3>
                            <p className="text-[11px] lg:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{category.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* RIGHT: Trust & Certificates */}
                    <div className="col-span-12 lg:col-span-4 bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7D32]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 leading-tight font-['Playfair_Display']">Why Choose <br/><span className="text-[#2E7D32]">Farmliv Industries?</span></h4>
                        <ul className="space-y-4">
                          {[
                            { icon: Award, text: "ISO 9001:2015", color: "text-[#D4AF37]" },
                            { icon: FileCheck, text: "ISO 14001:2015", color: "text-[#2E7D32]" },
                            { icon: Shield, text: "ISO 22000:2018", color: "text-[#E91E63]" },
                            { icon: Award, text: "ISO 45001:2018", color: "text-[#FF9800]" },
                            { icon: FileCheck, text: "ISO 50001:2018", color: "text-[#03A9F4]" }
                          ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-[11px] font-bold text-gray-700 uppercase tracking-tight">
                              <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-gray-100 ${item.color}`}>
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <span>{item.text} Standard</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link 
                        to="/products" 
                        onClick={handlePageMove} 
                        className="relative z-10 mt-8 p-4 bg-gray-900 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 group/link transition-all"
                      >
                        <span>View all products</span>
                        <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {['/certification', '/contact'].map(path => (
        <Link 
          key={path} 
          to={path} 
          onClick={() => window.scrollTo(0, 0)}
          className={`relative group font-medium text-[15px] tracking-wide transition-colors ${
            location.pathname === path ? 'text-[#2E7D32]' : 'text-gray-700 hover:text-[#2E7D32]'
          }`}
        >
          {path === '/certification' ? 'Certification' : 'Contact'}
          <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#2E7D32] rounded-full transition-all duration-300 ease-out group-hover:w-full ${location.pathname === path ? 'w-full' : 'w-0'}`}></span>
        </Link>
      ))}
    </div>
  );
});

const MobileNavItem = ({ to, children, icon: Icon, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      group flex items-center justify-between p-4 mb-2 rounded-xl transition-all duration-300
      ${active 
        ? 'bg-[#2E7D32]/10 text-[#2E7D32]' 
        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`
        p-2.5 rounded-lg transition-colors duration-300
        ${active ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-[#2E7D32]'}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-base font-semibold tracking-tight ${active ? 'font-bold' : ''}`}>
        {children}
      </span>
    </div>
    {active && (
      <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
    )}
  </Link>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);
  
  const handleNavigation = useCallback((path) => {
    navigate(path);
    window.scrollTo(0, 0);
    closeMobileMenu();
  }, [navigate, closeMobileMenu]);

  const mobileNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Users },
    { name: 'Products', path: '/products', icon: Sprout },
    { name: 'Certification', path: '/certification', icon: Award },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-300 will-change-transform
          ${isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-white/80 backdrop-blur-sm py-4'}
        `}
      >
        <div className={`
          absolute top-0 left-0 w-full bg-[#0F172A] text-white transition-all duration-300 overflow-hidden
          ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}
        `}>
          <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center text-xs font-medium tracking-wide">
            <div className="flex items-center gap-6">
              <a href="tel:+919181395595" className="flex items-center gap-2 hover:text-[#4CAF50] transition-colors" rel="noopener noreferrer">
                <Phone className="w-3 h-3" aria-hidden="true" />
                <span>+91 91813 95595</span>
              </a>
              <a href="mailto:sales@farmliv.com" className="hidden sm:flex items-center gap-2 hover:text-[#4CAF50] transition-colors" rel="noopener noreferrer">
                <Mail className="w-3 h-3" aria-hidden="true" />
                <span>sales@farmliv.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${!isScrolled && 'mt-10'}`}>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group relative z-[60]" onClick={() => { closeMobileMenu(); window.scrollTo(0, 0); }}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/10 group-hover:shadow-green-900/20 transition-all duration-300 shrink-0">
                <Leaf className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 font-['Playfair_Display'] leading-none tracking-tight">
                  Farmliv
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold group-hover:text-[#2E7D32] transition-colors">
                  Industries
                </span>
              </div>
            </Link>

            <DesktopMenu 
              isProductsOpen={isProductsOpen} 
              setIsProductsOpen={setIsProductsOpen} 
              location={location} 
            />

            <div className="hidden lg:flex items-center gap-4">
              <button 
                onClick={() => handleNavigation('/request-quote')} 
                className="
                  bg-[#2E7D32] text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-green-700/20 
                  hover:bg-[#1B5E20] hover:shadow-green-700/30 hover:-translate-y-0.5 
                  transition-all duration-300 flex items-center gap-2
                "
              >
                <span>Request Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:hidden flex items-center">
              <MenuToggle isOpen={isMobileMenuOpen} toggle={handleMobileMenuToggle} />
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[50] lg:hidden"
            />
            
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-gradient-to-b from-white to-gray-50 z-[60] lg:hidden shadow-2xl flex flex-col h-[100dvh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pt-8 pb-4 border-b border-gray-100/50 bg-white/50 backdrop-blur-sm flex justify-between items-center shrink-0">
                 <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">
                    Menu
                  </span>
                  <span className="text-xs text-gray-400 font-medium mt-1">
                    Farmliv Industries
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="flex flex-col gap-1">
                  {mobileNavItems.map((item) => (
                    <MobileNavItem 
                      key={item.path} 
                      to={item.path} 
                      icon={item.icon}
                      active={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.name}
                    </MobileNavItem>
                  ))}
                  
                  <div className="my-4 border-t border-gray-100/80 mx-2" />
                  
                  <Link
                    to="/request-quote"
                    onClick={() => handleNavigation('/request-quote')}
                    className="relative group flex items-center justify-between p-6 mx-2 mt-2 rounded-xl transition-all duration-300 overflow-hidden bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] shadow-lg shadow-green-900/20"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-2.5 rounded-lg bg-white/20 text-white backdrop-blur-sm">
                         <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-white tracking-tight">Request Quote</span>
                        <span className="text-xs text-green-100/80 font-medium">Get a custom price today</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/admin/login"
                    onClick={() => handleNavigation('/admin/login')}
                    className="flex items-center gap-4 p-4 mt-6 mx-2 rounded-xl text-gray-400 hover:text-[#2E7D32] hover:bg-emerald-50/50 transition-all border border-transparent hover:border-emerald-100 group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-sm">
                      <Lock size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Internal Staff Portal</span>
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 shrink-0 safe-area-bottom">
                <div className="space-y-4">
                  <a href="tel:+919181395595" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#2E7D32] transition-colors">
                    <Phone className="w-4 h-4 text-[#2E7D32]" />
                    <span className="font-semibold text-xs">+91 91813 95595</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Header);