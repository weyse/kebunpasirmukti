import React from 'react';
import { Calendar, Clock, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { useDashboardMetrics } from '@/hooks/dashboard';
import { StatCard } from '@/components/dashboard/StatCard';
import { VisitStatsChart } from '@/components/dashboard/VisitStatsChart';
import { UpcomingVisits } from '@/components/dashboard/UpcomingVisits';
import { formatCurrency } from '@/utils/formatters';

const Dashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { metrics, isLoading, updateChartPeriod } = useDashboardMetrics();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Selamat Datang, {user?.user_metadata?.full_name || 'User'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isAdmin ? 
            'Kelola reservasi dan akses sistem dari dashboard ini' : 
            'Lihat jadwal kunjungan dan detail reservasi di dashboard ini'}
        </p>
      </div>
      
      {/* Stats Overview removed as requested */}
      
      {/* Charts and upcoming visits */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <UpcomingVisits 
          upcomingVisits={metrics.upcomingVisits}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
