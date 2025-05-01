
import { format, isBefore, isAfter, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { UpcomingVisit, VisitData, MonthlyGrowthData } from '@/types/visit';

/**
 * Process visit data to calculate basic metrics
 */
export const processVisitData = (allVisits: VisitData[]) => {
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const previousMonth = startOfMonth(subMonths(now, 1));

  // Calculate total metrics
  const totalVisits = allVisits.length;
  
  const totalVisitors = allVisits.reduce((sum, visit) => 
    sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)), 0);
  
  const totalRevenue = allVisits.reduce((sum, visit) => sum + (visit.total_cost || 0), 0);
  
  // Filter visits by month
  const currentMonthVisits = allVisits.filter(visit => {
    const visitDate = parseISO(visit.visit_date);
    return !isBefore(visitDate, currentMonth);
  });
  
  const previousMonthVisits = allVisits.filter(visit => {
    const visitDate = parseISO(visit.visit_date);
    return !isBefore(visitDate, previousMonth) && isBefore(visitDate, currentMonth);
  });

  return {
    totalVisits,
    totalVisitors, 
    totalRevenue,
    currentMonthVisits,
    previousMonthVisits
  };
};

/**
 * Calculate monthly growth percentages and monthly visitor data for chart
 */
export const calculateMonthlyGrowth = (
  currentMonthVisits: VisitData[],
  previousMonthVisits: VisitData[]
): MonthlyGrowthData => {
  const now = new Date();
  
  // Calculate current month metrics
  const currentMonthVisitors = currentMonthVisits.reduce((sum, visit) => 
    sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)), 0);
  
  const currentMonthRevenue = currentMonthVisits.reduce((sum, visit) => 
    sum + (visit.total_cost || 0), 0);
  
  // Calculate previous month metrics
  const previousMonthVisitors = previousMonthVisits.reduce((sum, visit) => 
    sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)), 0);
  
  const previousMonthRevenue = previousMonthVisits.reduce((sum, visit) => 
    sum + (visit.total_cost || 0), 0);
  
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

  // Calculate monthly data for chart
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(now, 5 - i);
    return format(monthDate, 'MMM');
  });

  // Generate monthly visit data for chart
  return {
    visits: Math.round(visitsGrowth),
    visitors: Math.round(visitorsGrowth),
    revenue: Math.round(revenueGrowth),
    monthlyVisits: generateMonthlyChartData(last6Months, now)
  };
};

/**
 * Generate monthly chart data for visitor trends
 */
const generateMonthlyChartData = (months: string[], now: Date) => {
  return months.map(month => {
    const monthIndex = months.indexOf(month);
    const monthDate = subMonths(now, 5 - monthIndex);
    
    // We would normally get this data from the visits
    // This is a placeholder for demonstration purposes
    const randomVisitors = Math.floor(Math.random() * 100) + 20;
    
    return {
      name: month,
      visitors: randomVisitors
    };
  });
};

/**
 * Format upcoming visits data
 */
export const formatUpcomingVisits = (allVisits: VisitData[]): UpcomingVisit[] => {
  const now = new Date();
  
  return allVisits
    .filter(visit => isAfter(parseISO(visit.visit_date), now))
    .sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime())
    .slice(0, 3)
    .map(visit => ({
      id: visit.id,
      name: visit.institution_name,
      date: visit.visit_date,
      count: (visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)
    }));
};
