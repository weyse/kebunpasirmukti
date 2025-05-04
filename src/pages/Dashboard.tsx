import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardMetrics } from '@/hooks/dashboard';
import { UpcomingVisits } from '@/components/dashboard/UpcomingVisits';

const Dashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { metrics, isLoading } = useDashboardMetrics();
  
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
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingVisits 
          upcomingVisits={metrics.upcomingVisits}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
