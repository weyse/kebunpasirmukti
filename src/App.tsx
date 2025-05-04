import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ListChecks, Calendar, Lock, ClipboardList } from 'lucide-react';
import { Dashboard } from '@/pages/Dashboard';
import { VisitList } from '@/pages/VisitList';
import { CalendarView } from '@/pages/CalendarView';
import { GuestRegistrationForm } from '@/pages/GuestRegistrationForm';
import { GuestRegistrationList } from '@/pages/GuestRegistrationList';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { NotFound } from '@/pages/NotFound';
import { Forbidden } from '@/pages/Forbidden';
import { AdminPanel } from '@/pages/AdminPanel';
import { UserManagement } from '@/pages/UserManagement';
import { AddAdmin } from '@/pages/AddAdmin';
import { SetupAdmin } from '@/pages/SetupAdmin';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Laporan from '@/pages/Laporan';

function App() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visits" element={<VisitList />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/guest-registration/new" element={<GuestRegistrationForm />} />
          <Route path="/guest-registration/edit/:id" element={<GuestRegistrationForm />} />
          <Route path="/guest-registration/view/:id" element={<GuestRegistrationForm viewOnly={true} />} />
          <Route path="/guest-registration/list" element={<GuestRegistrationList />} />
          
          {/* Admin routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/add-admin" element={<AddAdmin />} />
            <Route path="/admin/setup" element={<SetupAdmin />} />
          </Route>
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
