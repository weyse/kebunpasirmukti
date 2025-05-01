
import { useState, useEffect } from 'react';
import { format, isBefore, isAfter, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMetrics, MonthlyVisitData, UpcomingVisit } from '@/types/visit';
import { toast } from 'sonner';

export const useDashboardData = () => {
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
    upcomingVisits: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get current date and previous month
        const now = new Date();
        const currentMonth = startOfMonth(now);
        const previousMonth = startOfMonth(subMonths(now, 1));
        
        // Get all visits
        const { data: allVisits, error: visitsError } = await supabase
          .from('guest_registrations')
          .select('id, order_id, institution_name, visit_date, adult_count, children_count, teacher_count, total_cost, payment_status')
          .order('visit_date', { ascending: false });
        
        if (visitsError) throw visitsError;
        
        if (!allVisits) {
          throw new Error('No data returned from Supabase');
        }

        // Calculate metrics
        const totalVisits = allVisits.length;
        
        const totalVisitors = allVisits.reduce((sum, visit) => 
          sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)), 0);
        
        const totalRevenue = allVisits.reduce((sum, visit) => sum + (visit.total_cost || 0), 0);
        
        // Calculate monthly data for chart
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const monthDate = subMonths(now, 5 - i);
          return format(monthDate, 'MMM');
        });
        
        const monthlyVisits = last6Months.map(month => {
          const monthIndex = last6Months.indexOf(month);
          const monthDate = subMonths(now, 5 - monthIndex);
          const startDate = startOfMonth(monthDate);
          const endDate = endOfMonth(monthDate);
          
          const visitsInMonth = allVisits.filter(visit => {
            const visitDate = parseISO(visit.visit_date);
            return !isBefore(visitDate, startDate) && !isAfter(visitDate, endDate);
          });
          
          const visitors = visitsInMonth.reduce((sum, visit) => 
            sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)), 0);
          
          return {
            name: month,
            visitors
          };
        });
        
        // Calculate growth percentages
        const currentMonthVisits = allVisits.filter(visit => {
          const visitDate = parseISO(visit.visit_date);
          return !isBefore(visitDate, currentMonth);
        });
        
        const previousMonthVisits = allVisits.filter(visit => {
          const visitDate = parseISO(visit.visit_date);
          return !isBefore(visitDate, previousMonth) && isBefore(visitDate, currentMonth);
        });
        
        const currentMonthVisitors = currentMonthVisits.reduce((sum, visit) => 
          sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)), 0);
        
        const previousMonthVisitors = previousMonthVisits.reduce((sum, visit) => 
          sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)), 0);
        
        const currentMonthRevenue = currentMonthVisits.reduce((sum, visit) => sum + (visit.total_cost || 0), 0);
        const previousMonthRevenue = previousMonthVisits.reduce((sum, visit) => sum + (visit.total_cost || 0), 0);
        
        // Calculate growth percentages
        const visitsGrowth = previousMonthVisits.length 
          ? ((currentMonthVisits.length - previousMonthVisits.length) / previousMonthVisits.length) * 100 
          : 0;
        
        const visitorsGrowth = previousMonthVisitors 
          ? ((currentMonthVisitors - previousMonthVisitors) / previousMonthVisitors) * 100 
          : 0;
        
        const revenueGrowth = previousMonthRevenue 
          ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
          : 0;
        
        // Get upcoming visits
        const upcomingVisits = allVisits
          .filter(visit => isAfter(parseISO(visit.visit_date), now))
          .sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime())
          .slice(0, 3)
          .map(visit => ({
            id: visit.id,
            name: visit.institution_name,
            date: visit.visit_date,
            count: (visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)
          }));
        
        // Set all metrics
        setMetrics({
          totalVisits,
          totalVisitors,
          totalRevenue,
          monthlyGrowth: {
            visits: Math.round(visitsGrowth),
            visitors: Math.round(visitorsGrowth),
            revenue: Math.round(revenueGrowth)
          },
          monthlyVisits,
          upcomingVisits
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return { metrics, isLoading };
};
