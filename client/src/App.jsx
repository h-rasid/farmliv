import React, { Suspense, useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LoadingFallback from './components/ui/LoadingFallback';
import { AnimatePresence, LazyMotion } from 'framer-motion';
import { API_BASE, API_URL } from '@/utils/config';
import './styles/public.css';

// ⭐ Existing Components
// ⭐ Lazy Loaded Global Components
const FloatingContactButtons = React.lazy(() => import('./components/FloatingContactButtons'));
const QuickEnquiryTab = React.lazy(() => import('./components/QuickEnquiryTab'));
const QuickEnquiryModal = React.lazy(() => import('./components/QuickEnquiryModal'));
const Toaster = React.lazy(() => import('./components/ui/toaster').then(m => ({ default: m.Toaster })));
// --- Lazy Load Layouts & Main Pages ---
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PortalLayout = React.lazy(() => import('./layouts/PortalLayout'));
const SystemLogs = React.lazy(() => import('./pages/admin/SystemLogs'));

// --- Lazy Load Public Pages ---
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CertificationPage = React.lazy(() => import('./pages/CertificationPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const RequestQuotePage = React.lazy(() => import('./pages/RequestQuotePage'));
const ThankYouPage = React.lazy(() => import('./pages/ThankYouPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const DisclaimerPage = React.lazy(() => import('./pages/DisclaimerPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

// --- Lazy Load Admin Pages ---
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ProductManagementPage = React.lazy(() => import('./pages/admin/ProductManagementPage'));
const CategoryManagement = React.lazy(() => import('./pages/admin/CategoryManagement')); 
const StaffManagementPage = React.lazy(() => import('./pages/admin/StaffManagementPage'));
const InquiriesManagementPage = React.lazy(() => import('./pages/admin/InquiriesManagementPage'));
const CustomerManagementPage = React.lazy(() => import('./pages/admin/CustomerManagementPage'));
const AdminSalesPerformance = React.lazy(() => import('./pages/admin/AdminSalesPerformance'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const ReportsAnalytics = React.lazy(() => import('./pages/admin/ReportsAnalytics')); 
const CRMHub = React.lazy(() => import('./pages/admin/CRMHub'));
const QuoteEngine = React.lazy(() => import('./pages/admin/QuoteEngine'));

const QuickEnquiryManagement = React.lazy(() => import('./pages/admin/QuickEnquiryManagement'));
const BillingFinance = React.lazy(() => import('./pages/admin/BillingFinance'));
const MarketingCampaigns = React.lazy(() => import('./pages/admin/MarketingCampaigns'));
const MarketingPromotions = React.lazy(() => import('./pages/admin/MarketingPromotions'));

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
            <Route path="/heavy-duty-weed-control-mat-manufacturer" element={<ProductDetailPage productIdOverride="2" />} />
            <Route path="/uv-stabilized-agriculture-shade-net-manufacturer" element={<ProductDetailPage productIdOverride="3" />} />
            <Route path="/pp-leno-mesh-bag-manufacturer" element={<ProductDetailPage productIdOverride="4" />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/certification" element={<CertificationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/request-quote" element={<RequestQuotePage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />

            {/* AUTHENTICATION */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/salesman/login" element={<SalesmanLogin />} />

            {/* ADMIN PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRole="admin"><PortalLayout role="admin" /></ProtectedRoute>}>
              <Route path="/admin-portal" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductManagementPage />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/leads" element={<InquiriesManagementPage />} />
              <Route path="/admin/customers" element={<CustomerManagementPage />} />
              <Route path="/admin/crm" element={<CRMHub />} />
              <Route path="/admin/quote" element={<QuoteEngine />} />
              <Route path="/admin/quote/new" element={<QuoteEngine />} />
              <Route path="/admin/quote/history" element={<QuoteEngine />} />
              <Route path="/admin/billing" element={<BillingFinance />} />
              <Route path="/admin/billing/invoices" element={<BillingFinance />} />
              <Route path="/admin/billing/payments" element={<BillingFinance />} />
              <Route path="/admin/marketing" element={<Navigate to="/admin/marketing/campaigns" replace />} />
              <Route path="/admin/marketing/campaigns" element={<MarketingCampaigns />} />
              <Route path="/admin/marketing/promotions" element={<MarketingPromotions />} />
              <Route path="/admin/reports" element={<ReportsAnalytics />} />
              <Route path="/admin/reports/sales" element={<ReportsAnalytics />} />
              <Route path="/admin/sales-performance" element={<AdminSalesPerformance />} />
              <Route path="/admin/staff" element={<StaffManagementPage />} />
              <Route path="/admin/staff/performance" element={<ReportsAnalytics />} />
              <Route path="/admin/quick-enquiries" element={<QuickEnquiryManagement />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/settings/roles" element={<AdminSettings />} />
              <Route path="/admin/settings/access" element={<AdminSettings />} />
              <Route path="/admin/logs" element={<SystemLogs />} />
              <Route path="/admin/logs/activity" element={<SystemLogs />} />
              <Route path="/admin/logs/security" element={<SystemLogs />} />
            </Route>

            {/* SALESMAN PROTECTED ROUTES */}
            <Route element={<ProtectedRoute allowedRole="salesman"><PortalLayout role="salesman" /></ProtectedRoute>}>
              <Route path="/salesman-portal" element={<SalesDashboard />} />
              <Route path="/salesman/leads" element={<SalesLeadsPage />} />
              <Route path="/salesman/enquiries" element={<SalesEnquiriesPage />} />
              <Route path="/salesman/customers" element={<SalesCustomersPage />} />
              <Route path="/salesman/catalog" element={<ProductCatalog />} />
              <Route path="/salesman/new-order" element={<SalesOrderCreation />} />
              <Route path="/salesman/visits" element={<VisitManagementPage />} />
              <Route path="/salesman/payments" element={<PaymentCollectionPage />} />
              <Route path="/salesman/tasks" element={<TaskManagementPage />} />
              <Route path="/salesman/reports" element={<SalesmanReports />} />
              <Route path="/salesman/history" element={<SalesHistory />} />
              <Route path="/salesman/profile" element={<ProfileSettings />} />
            </Route>

            {/* CATCH-ALL REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {!isStaffArea && (
        <Suspense fallback={null}>
          <QuickEnquiryTab openModal={onOpenModal} />
          <FloatingContactButtons />
        </Suspense>
      )}
    </>
  );
};

const loadFeatures = () => import('@/utils/framer-features').then(res => res.default);

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
    <LazyMotion features={loadFeatures} strict>
      <Router>
        <ScrollToTop />
        <AnimatedRoutes onOpenModal={() => setIsModalOpen(true)} />
        <Suspense fallback={null}>
          <QuickEnquiryModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
          <Toaster />
        </Suspense>
      </Router>
    </LazyMotion>
  );
}

export default App;

