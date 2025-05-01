
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMetrics, VisitData } from '@/types/visit';
import { toast } from 'sonner';
import { 
  processVisitData, 
  calculateMonthlyGrowth, 
  formatUpcomingVisits 
} from '@/utils/dashboardUtils';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalVisits: 0,
    totalVisitors: 0,
    totalRevenue: 0,
    monthlyGrowth: {
      visits: 0,
      visitors: 0,
      revenue: 0,
    },
    monthlyVisits: [],
    upcomingVisits: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get all visits
        const { data: allVisits, error: visitsError } = await supabase
          .from('guest_registrations')
          .select('id, order_id, institution_name, visit_date, adult_count, children_count, teacher_count, total_cost, payment_status')
          .order('visit_date', { ascending: false });
        
        if (visitsError) throw visitsError;
        
        if (!allVisits) {
          throw new Error('No data returned from Supabase');
        }

        // Process the visit data to calculate metrics
        const { 
          totalVisits,
          totalVisitors,
          totalRevenue,
          currentMonthVisits,
          previousMonthVisits
        } = processVisitData(allVisits as VisitData[]);
        
        // Calculate monthly growth percentages
        const monthlyGrowth = calculateMonthlyGrowth(
          currentMonthVisits,
          previousMonthVisits
        );
        
        // Get upcoming visits
        const upcomingVisits = formatUpcomingVisits(allVisits as VisitData[]);
        
        // Set all metrics
        setMetrics({
          totalVisits,
          totalVisitors,
          totalRevenue,
          monthlyGrowth,
          monthlyVisits: monthlyGrowth.monthlyVisits,
          upcomingVisits
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return { metrics, isLoading };
};
