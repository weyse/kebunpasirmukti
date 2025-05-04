<<<<<<< HEAD
=======

>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import VisitList from './pages/VisitList';
import CalendarView from './pages/CalendarView';
import GuestRegistrationList from './pages/guest/GuestRegistrationList';
import GuestRegistrationForm from './pages/guest/GuestRegistrationForm';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Forbidden from './pages/Forbidden';
import UserManagement from './pages/admin/UserManagement';
import AddAdmin from './pages/admin/AddAdmin';
import SetupAdmin from './pages/admin/SetupAdmin';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
<<<<<<< HEAD
import Laporan from './pages/laporan';
=======
>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for current session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    checkSession();
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle Vercel redeployments by checking if we have a 404 path with hash
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // If we have a hash and are on a path that looks like a 404 error
    if (hash && (path.includes('404') || path.includes('not-found'))) {
      // Strip off the hash and navigate to the root
      window.history.replaceState(null, document.title, '/');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pasirmukti-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
          <Route path="/forbidden" element={<Forbidden />} />
          
          {/* Admin Setup Route - available to authenticated users */}
          <Route path="/setup-admin" element={
            <ProtectedRoute requiresAdmin={true}>
              <SetupAdmin />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            
            {/* Routes accessible by all authenticated users */}
            <Route path="calendar" element={<CalendarView />} />
            
            {/* Admin-only routes */}
            <Route path="visit-list" element={
              <ProtectedRoute requiresAdmin={true}>
                <VisitList />
              </ProtectedRoute>
            } />
            <Route path="guest-registration" element={
              <ProtectedRoute requiresAdmin={true}>
                <GuestRegistrationList />
              </ProtectedRoute>
            } />
            <Route path="guest-registration/new" element={
              <ProtectedRoute requiresAdmin={true}>
                <GuestRegistrationForm />
              </ProtectedRoute>
            } />
            <Route path="guest-registration/edit/:id" element={
              <ProtectedRoute requiresAdmin={true}>
                <GuestRegistrationForm />
              </ProtectedRoute>
            } />
            <Route path="guest-registration/view/:id" element={
              <ProtectedRoute requiresAdmin={true}>
                <GuestRegistrationForm />
              </ProtectedRoute>
            } />
            <Route path="check-in/:id" element={
              <ProtectedRoute requiresAdmin={true}>
                <GuestRegistrationForm />
              </ProtectedRoute>
            } />
            
            {/* Admin management routes */}
            <Route path="admin/users" element={
              <ProtectedRoute requiresAdmin={true}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="admin/setup" element={
              <ProtectedRoute requiresAdmin={true}>
                <SetupAdmin />
              </ProtectedRoute>
            } />
<<<<<<< HEAD
            <Route path="laporan" element={
              <ProtectedRoute requiresAdmin={true}>
                <Laporan />
              </ProtectedRoute>
            } />
=======
>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23
          </Route>
          
          {/* 404 Route - this must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
