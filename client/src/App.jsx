import React, { Suspense, useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import ScrollToTop from './components/ScrollToTop';
import LoadingFallback from './components/ui/LoadingFallback';
import { AnimatePresence, motion } from 'framer-motion';
import { API_BASE, API_URL } from '@/utils/config';

// ⭐ Existing Components
import FloatingContactButtons from './components/FloatingContactButtons';
import QuickEnquiryTab from './components/QuickEnquiryTab';
import HomePage from './pages/HomePage';

// ⭐ Modal for Popup behavior
import QuickEnquiryModal from './components/QuickEnquiryModal';

// --- Lazy Load Public Pages ---
// HomePage is now statically imported for better performance
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CertificationPage = React.lazy(() => import('./pages/CertificationPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const RequestQuotePage = React.lazy(() => import('./pages/RequestQuotePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

// --- Lazy Load Admin Pages ---
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ProductManagementPage = React.lazy(() => import('./pages/admin/ProductManagementPage'));
const CategoryManagement = React.lazy(() => import('./pages/admin/CategoryManagement')); 
const StaffManagementPage = React.lazy(() => import('./pages/admin/StaffManagementPage'));
const InquiriesManagementPage = React.lazy(() => import('./pages/admin/InquiriesManagementPage'));
const AdminSalesPerformance = React.lazy(() => import('./pages/admin/AdminSalesPerformance'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const ReportsAnalytics = React.lazy(() => import('./pages/admin/ReportsAnalytics')); 

// ⭐ NEW: Lazy Load Quick Enquiry Hub (Popup Data)
const QuickEnquiryManagement = React.lazy(() => import('./pages/admin/QuickEnquiryManagement'));

// --- Lazy Load Salesman Pages ---
const SalesDashboard = React.lazy(() => import('./pages/salesman/SalesDashboard')); 
const ProfileSettings = React.lazy(() => import('./pages/salesman/ProfileSettings'));



// --- 🛡️ Protected Route Component ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('farmliv_user'));
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  const userRole = user.role?.toLowerCase();
  const targetRole = allowedRole?.toLowerCase();

  if (targetRole === 'salesman') {
    if (userRole !== 'salesman' && userRole !== 'sales_person') {
      return <Navigate to="/" replace />;
    }
  } else if (userRole !== targetRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// ⭐ Updated: Trigger popup from any route/tab
const AnimatedRoutes = ({ onOpenModal }) => {
  const location = useLocation();
  const isStaffArea = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/salesman') || 
                      location.pathname.includes('-portal');
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:categoryId" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/certification" element={<CertificationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/request-quote" element={<RequestQuotePage />} />

            {/* AUTHENTICATION */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* ADMIN PROTECTED ROUTES */}
            <Route path="/admin-portal" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute allowedRole="admin"><ProductManagementPage /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute allowedRole="admin"><CategoryManagement /></ProtectedRoute>} />
            <Route path="/admin/leads" element={<ProtectedRoute allowedRole="admin"><InquiriesManagementPage /></ProtectedRoute>} />
            
            <Route 
                path="/admin/quick-enquiries" 
                element={<ProtectedRoute allowedRole="admin"><QuickEnquiryManagement /></ProtectedRoute>} 
            />

            <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><ReportsAnalytics /></ProtectedRoute>} />
            <Route path="/admin/sales-performance" element={<ProtectedRoute allowedRole="admin"><AdminSalesPerformance /></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute allowedRole="admin"><StaffManagementPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />

            {/* SALESMAN PROTECTED ROUTES */}
            <Route path="/salesman-portal" element={<ProtectedRoute allowedRole="salesman"><SalesDashboard /></ProtectedRoute>} />
            <Route path="/salesman/profile" element={<ProtectedRoute allowedRole="salesman"><ProfileSettings /></ProtectedRoute>} />

            {/* CATCH-ALL REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {!isStaffArea && (
        <>
          <QuickEnquiryTab openModal={onOpenModal} />
          <FloatingContactButtons />
        </>
      )}
    </>
  );
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log(`Checking Connection to: ${API_URL}`);
      try {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const settings = await response.json();
        console.log("✅ Database Settings Connected");
        
        if (settings && settings.favicon) {
          const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
          link.rel = 'icon';
          link.href = settings.favicon.startsWith('http') 
            ? settings.favicon 
            : `${API_BASE}${settings.favicon}`;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      } catch (error) {
        console.error("❌ Database Connection Sync Failed:", error.message);
      }
    };

    initializeApp();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes onOpenModal={() => setIsModalOpen(true)} />
      <QuickEnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <Toaster />
    </Router>
  );
}

export default App;
