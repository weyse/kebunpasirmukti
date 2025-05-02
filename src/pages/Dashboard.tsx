
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Users, ArrowRight, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';
import { StatCard } from '@/components/dashboard/StatCard';
import { VisitStatsChart } from '@/components/dashboard/VisitStatsChart';
import { UpcomingVisits } from '@/components/dashboard/UpcomingVisits';
import { formatCurrency } from '@/components/dashboard/DashboardUtils';
import { ChartPeriod } from '@/types/visit';

const Dashboard = () => {
  const navigate = useNavigate();
  const { metrics, isLoading, updateChartPeriod } = useDashboardMetrics();

  const handlePeriodChange = (period: ChartPeriod) => {
    updateChartPeriod(period);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
          onClick={() => navigate('/guest-registration/new')}
        >
          + Registrasi Baru
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Kunjungan"
          value={metrics.totalVisits}
          change={metrics.monthlyGrowth.visits} 
          icon={CalendarCheck}
          isLoading={isLoading} 
        />
        
        <StatCard 
          title="Total Pengunjung"
          value={metrics.totalVisitors.toLocaleString('id-ID')}
          change={metrics.monthlyGrowth.visitors}
          icon={Users}
          isLoading={isLoading} 
        />
        
        <StatCard 
          title="Total Pendapatan"
          value={formatCurrency(metrics.totalRevenue)}
          change={metrics.monthlyGrowth.revenue}
          icon={DollarSign}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <VisitStatsChart 
          data={metrics.monthlyVisits} 
          isLoading={isLoading}
          selectedPeriod={metrics.selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
        
        <UpcomingVisits 
          upcomingVisits={metrics.upcomingVisits} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
