<<<<<<< HEAD
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardMetrics } from '@/hooks/dashboard';
import { UpcomingVisits } from '@/components/dashboard/UpcomingVisits';

const Dashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { metrics, isLoading } = useDashboardMetrics();
=======

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
>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23
  
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
<<<<<<< HEAD
      <div className="grid gap-6 md:grid-cols-2">
=======
      
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Kunjungan" 
          value={metrics.totalVisits.toString()}
          change={metrics.monthlyGrowth.visits}
          icon={Calendar}
          isLoading={isLoading}
        />
        
        <StatCard 
          title="Total Pengunjung" 
          value={metrics.totalVisitors.toString()}
          change={metrics.monthlyGrowth.visitors}
          icon={Clock}
          isLoading={isLoading}
        />
        
        <StatCard 
          title="Pendapatan Total" 
          value={formatCurrency(metrics.totalRevenue)}
          change={metrics.monthlyGrowth.revenue}
          icon={CreditCard}
          isLoading={isLoading}
        />
      </div>
      
      {/* Charts and upcoming visits */}
      <div className="grid gap-6 md:grid-cols-2">
        <VisitStatsChart 
          data={metrics.monthlyVisits}
          isLoading={isLoading}
          selectedPeriod={metrics.selectedPeriod}
          onPeriodChange={updateChartPeriod}
        />
        
>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23
        <UpcomingVisits 
          upcomingVisits={metrics.upcomingVisits}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
