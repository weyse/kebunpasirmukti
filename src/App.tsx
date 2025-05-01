
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import GuestRegistrationForm from "./pages/guest/GuestRegistrationForm";
import GuestRegistrationList from "./pages/guest/GuestRegistrationList";
import CalendarView from "./pages/CalendarView";
import VisitList from "./pages/VisitList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="guest-registration" element={<GuestRegistrationList />} />
            <Route path="guest-registration/new" element={<GuestRegistrationForm />} />
            <Route path="guest-registration/:id" element={<GuestRegistrationForm />} />
            <Route path="guest-registration/edit/:id" element={<GuestRegistrationForm />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="visit-list" element={<VisitList />} />
            {/* More routes for Reports, Settings, etc. */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
