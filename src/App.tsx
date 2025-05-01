
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
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pasirmukti-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={user ? <AppLayout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="visit-list" element={<VisitList />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="guest-registration" element={<GuestRegistrationList />} />
          <Route path="guest-registration/new" element={<GuestRegistrationForm />} />
          <Route path="guest-registration/edit/:id" element={<GuestRegistrationForm />} />
          <Route path="guest-registration/view/:id" element={<GuestRegistrationForm />} />
          <Route path="check-in/:id" element={<GuestRegistrationForm />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
