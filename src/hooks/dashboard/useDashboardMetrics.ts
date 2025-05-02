
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMetrics, VisitData, ChartPeriod } from '@/types/visit';
import { toast } from 'sonner';
import { 
  processVisitData, 
  calculateMonthlyGrowth, 
  formatUpcomingVisits,
  generateVisitorChartData
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
      monthlyVisits: []
    },
    monthlyVisits: [],
    upcomingVisits: [],
    selectedPeriod: 'month'
  });
  
  const [allVisits, setAllVisits] = useState<VisitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all visit data
  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        setIsLoading(true);
        
        // Get all visits
        const { data: visitData, error: visitsError } = await supabase
          .from('guest_registrations')
          .select('id, order_id, institution_name, visit_date, adult_count, children_count, teacher_count, total_cost, payment_status')
          .order('visit_date', { ascending: false });
        
        if (visitsError) throw visitsError;
        
        if (!visitData) {
          throw new Error('No data returned from Supabase');
        }

        setAllVisits(visitData as VisitData[]);
        
        // Process the visit data to calculate metrics
        const { 
          totalVisits,
          totalVisitors,
          totalRevenue,
          currentMonthVisits,
          previousMonthVisits
        } = processVisitData(visitData as VisitData[]);
        
        // Calculate monthly growth percentages
        const monthlyGrowth = calculateMonthlyGrowth(
          currentMonthVisits,
          previousMonthVisits
        );
        
        // Get upcoming visits
        const upcomingVisits = formatUpcomingVisits(visitData as VisitData[]);
        
        // Generate chart data with real data
        const monthlyVisits = generateVisitorChartData(new Date(), 'month', visitData as VisitData[]);
        
        // Set all metrics
        setMetrics({
          totalVisits,
          totalVisitors,
          totalRevenue,
          monthlyGrowth,
          monthlyVisits,
          upcomingVisits,
          selectedPeriod: 'month'
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVisitData();
  }, []);
  
  // Update chart data when period changes
  const updateChartPeriod = (period: ChartPeriod) => {
    if (!allVisits.length) return;
    
    const chartData = generateVisitorChartData(new Date(), period, allVisits);
    
    setMetrics(prev => ({
      ...prev,
      monthlyVisits: chartData,
      selectedPeriod: period
    }));
  };
  
  return { 
    metrics, 
    isLoading,
    updateChartPeriod 
  };
};
