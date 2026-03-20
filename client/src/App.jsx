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

// ⭐ Modal for Popup behavior
import QuickEnquiryModal from './components/QuickEnquiryModal';
import HomePage from './pages/HomePage';
import SystemLogs from './pages/admin/SystemLogs';

// --- Lazy Load Public Pages ---
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
const CustomerManagementPage = React.lazy(() => import('./pages/admin/CustomerManagementPage'));
const OrderManagementPage = React.lazy(() => import('./pages/admin/OrderManagementPage'));
const AdminSalesPerformance = React.lazy(() => import('./pages/admin/AdminSalesPerformance'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const ReportsAnalytics = React.lazy(() => import('./pages/admin/ReportsAnalytics')); 
const CRMHub = React.lazy(() => import('./pages/admin/CRMHub'));
const QuoteEngine = React.lazy(() => import('./pages/admin/QuoteEngine'));

const QuickEnquiryManagement = React.lazy(() => import('./pages/admin/QuickEnquiryManagement'));
const BillingFinance = React.lazy(() => import('./pages/admin/BillingFinance'));

// --- Lazy Load Salesman Pages ---
const SalesDashboard = React.lazy(() => import('./pages/salesman/SalesDashboard')); 
const SalesLeadsPage = React.lazy(() => import('./pages/salesman/SalesLeadsPage'));
const SalesEnquiriesPage = React.lazy(() => import('./pages/salesman/SalesEnquiriesPage'));
const SalesCustomersPage = React.lazy(() => import('./pages/salesman/SalesCustomersPage'));
const ProductCatalog = React.lazy(() => import('./pages/salesman/ProductCatalog'));
const SalesOrderCreation = React.lazy(() => import('./pages/salesman/SalesOrderCreation'));
const VisitManagementPage = React.lazy(() => import('./pages/salesman/VisitManagementPage'));
const PaymentCollectionPage = React.lazy(() => import('./pages/salesman/PaymentCollectionPage'));
const TaskManagementPage = React.lazy(() => import('./pages/salesman/TaskManagementPage'));
const SalesmanReports = React.lazy(() => import('./pages/salesman/SalesmanReports'));
const SalesHistory = React.lazy(() => import('./pages/salesman/SalesHistory'));
const SalesmanLogin = React.lazy(() => import('./pages/salesman/SalesmanLogin'));
const ProfileSettings = React.lazy(() => import('./pages/salesman/ProfileSettings'));


// --- 🛡️ Protected Route Component ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const sessionKey = allowedRole === 'admin' ? 'farmliv_admin' : 'farmliv_salesman';
  const user = JSON.parse(localStorage.getItem(sessionKey));
  const location = useLocation();
  
  if (!user) {
    // Redirect to the appropriate login hub
    const loginPath = allowedRole === 'admin' ? '/admin/login' : '/salesman/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  const userRole = (user.role || '').toLowerCase();
  const targetRole = allowedRole?.toLowerCase();

  // Unified validation for salesman/sales_person
  if (targetRole === 'salesman') {
    if (userRole !== 'salesman' && userRole !== 'sales_person') {
      return <Navigate to="/salesman/login" replace />;
    }
  } else if (userRole !== targetRole) {
    return <Navigate to="/admin/login" replace />;
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
            <Route path="/salesman/login" element={<SalesmanLogin />} />

            {/* ADMIN PROTECTED ROUTES */}
            <Route path="/admin-portal" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute allowedRole="admin"><ProductManagementPage /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute allowedRole="admin"><CategoryManagement /></ProtectedRoute>} />
            <Route path="/admin/leads" element={<ProtectedRoute allowedRole="admin"><InquiriesManagementPage /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute allowedRole="admin"><CustomerManagementPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRole="admin"><OrderManagementPage /></ProtectedRoute>} />
            <Route path="/admin/crm" element={<ProtectedRoute allowedRole="admin"><CRMHub /></ProtectedRoute>} />
            <Route path="/admin/quote" element={<ProtectedRoute allowedRole="admin"><QuoteEngine /></ProtectedRoute>} />
            <Route path="/admin/quote/new" element={<ProtectedRoute allowedRole="admin"><QuoteEngine /></ProtectedRoute>} />
            <Route path="/admin/quote/history" element={<ProtectedRoute allowedRole="admin"><QuoteEngine /></ProtectedRoute>} />
            
            <Route path="/admin/billing" element={<ProtectedRoute allowedRole="admin"><BillingFinance /></ProtectedRoute>} />
            <Route path="/admin/billing/invoices" element={<ProtectedRoute allowedRole="admin"><BillingFinance /></ProtectedRoute>} />
            <Route path="/admin/billing/payments" element={<ProtectedRoute allowedRole="admin"><BillingFinance /></ProtectedRoute>} />

            <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><ReportsAnalytics /></ProtectedRoute>} />
            <Route path="/admin/reports/sales" element={<ProtectedRoute allowedRole="admin"><ReportsAnalytics /></ProtectedRoute>} />
            
            <Route path="/admin/sales-performance" element={<ProtectedRoute allowedRole="admin"><AdminSalesPerformance /></ProtectedRoute>} />
            
            <Route path="/admin/staff" element={<ProtectedRoute allowedRole="admin"><StaffManagementPage /></ProtectedRoute>} />
            <Route path="/admin/staff/performance" element={<ProtectedRoute allowedRole="admin"><ReportsAnalytics /></ProtectedRoute>} />

            <Route 
                path="/admin/quick-enquiries" 
                element={<ProtectedRoute allowedRole="admin"><QuickEnquiryManagement /></ProtectedRoute>} 
            />

            <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/settings/roles" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/settings/access" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />
 
            <Route path="/admin/logs" element={<ProtectedRoute allowedRole="admin"><SystemLogs /></ProtectedRoute>} />
            <Route path="/admin/logs/activity" element={<ProtectedRoute allowedRole="admin"><SystemLogs /></ProtectedRoute>} />
            <Route path="/admin/logs/security" element={<ProtectedRoute allowedRole="admin"><SystemLogs /></ProtectedRoute>} />

            {/* SALESMAN PROTECTED ROUTES */}
            <Route path="/salesman-portal" element={<ProtectedRoute allowedRole="salesman"><SalesDashboard /></ProtectedRoute>} />
            <Route path="/salesman/leads" element={<ProtectedRoute allowedRole="salesman"><SalesLeadsPage /></ProtectedRoute>} />
            <Route path="/salesman/enquiries" element={<ProtectedRoute allowedRole="salesman"><SalesEnquiriesPage /></ProtectedRoute>} />
            <Route path="/salesman/customers" element={<ProtectedRoute allowedRole="salesman"><SalesCustomersPage /></ProtectedRoute>} />
            <Route path="/salesman/catalog" element={<ProtectedRoute allowedRole="salesman"><ProductCatalog /></ProtectedRoute>} />
            <Route path="/salesman/new-order" element={<ProtectedRoute allowedRole="salesman"><SalesOrderCreation /></ProtectedRoute>} />
            <Route path="/salesman/visits" element={<ProtectedRoute allowedRole="salesman"><VisitManagementPage /></ProtectedRoute>} />
            <Route path="/salesman/payments" element={<ProtectedRoute allowedRole="salesman"><PaymentCollectionPage /></ProtectedRoute>} />
            <Route path="/salesman/tasks" element={<ProtectedRoute allowedRole="salesman"><TaskManagementPage /></ProtectedRoute>} />
            <Route path="/salesman/reports" element={<ProtectedRoute allowedRole="salesman"><SalesmanReports /></ProtectedRoute>} />
            <Route path="/salesman/history" element={<ProtectedRoute allowedRole="salesman"><SalesHistory /></ProtectedRoute>} />
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
  const [initialLoading, setInitialLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // ⭐ Make non-blocking for better LCP
    setInitialLoading(false);

    const initializeApp = async () => {
      console.log(`v1.0.4-prod - Checking Connection to: ${API_URL}`);
      
      try {
        const response = await fetch(`${API_URL}/settings`);

        if (response && response.ok) {
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
        }
      } catch (error) {
        console.warn("⚠️ Database Connection Sync Delayed or Failed:", error.message);
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
