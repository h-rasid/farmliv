import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingFallback from './ui/LoadingFallback';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // 1. LocalStorage se user data aur token check karein
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const location = useLocation();

  // 2. Agar user logged in nahi hai
  if (!user) {
    // Current path save karein taaki login ke baad user wapis wahin aaye
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Validation
  // Agar allowedRoles define kiya gaya hai (e.g. ['admin'])
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Agar role match nahi karta (e.g. Salesman tries to open Admin Dashboard)
    // Use uske respective dashboard par wapis bhej dein
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/admin/sales-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // 4. Sab sahi hai, toh component render karein
  return children;
};

export default ProtectedRoute;