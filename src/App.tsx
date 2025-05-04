
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import VisitList from '@/pages/VisitList';
import CalendarView from '@/pages/CalendarView';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Laporan from '@/pages/Laporan';
import { AuthContext } from '@/context/AuthContext';

// Fix incorrect import format
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import NotFound from '@/pages/NotFound';
import Forbidden from '@/pages/Forbidden';

function App() {
  // Temporarily remove useAuth hook since it's missing
  // const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get auth context directly instead of using hook
  const auth = React.useContext(AuthContext);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visits" element={<VisitList />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/laporan" element={<Laporan />} />
        
        {/* Comment out routes with missing components */}
        {/*
        <Route path="/guest-registration/new" element={<GuestRegistrationForm />} />
        <Route path="/guest-registration/edit/:id" element={<GuestRegistrationForm />} />
        <Route path="/guest-registration/view/:id" element={<GuestRegistrationForm viewOnly={true} />} />
        <Route path="/guest-registration/list" element={<GuestRegistrationList />} />
        */}
        
        {/* Admin routes - comment out missing components */}
        {/*
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/add-admin" element={<AddAdmin />} />
          <Route path="/admin/setup" element={<SetupAdmin />} />
        </Route>
        */}
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
