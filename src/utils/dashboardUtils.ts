
import { format, isBefore, isAfter, parseISO, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';
import { UpcomingVisit, VisitData, MonthlyGrowthData, ChartPeriod, VisitorChartData } from '@/types/visit';

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
  
  // Generate monthly visit data for chart
  const chartData = generateVisitorChartData(now, "month", []);
  
  return {
    visits: Math.round(visitsGrowth),
    visitors: Math.round(visitorsGrowth),
    revenue: Math.round(revenueGrowth),
    monthlyVisits: chartData
  };
};

/**
 * Generate visitor chart data based on period (day, week, month, year)
 */
export const generateVisitorChartData = (
  date: Date = new Date(),
  period: ChartPeriod = "month",
  visits: VisitData[] = []
): VisitorChartData[] => {
  let intervals: Date[] = [];
  let formatPattern: string = "";
  let startDate: Date = new Date();
  let endDate: Date = new Date();
  const now = date;
  
  // Set up intervals based on selected period
  switch (period) {
    case "day":
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
      intervals = eachDayOfInterval({ start: startDate, end: endDate });
      formatPattern = "EEE";
      break;
    case "week":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      intervals = eachWeekOfInterval({ start: startDate, end: endDate });
      formatPattern = "'Week' w";
      break;
    case "month":
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      intervals = eachMonthOfInterval({ start: startDate, end: endDate });
      formatPattern = "MMM";
      break;
    case "year":
      startDate = new Date(now.getFullYear() - 5, 0, 1);
      endDate = now;
      intervals = eachYearOfInterval({ start: startDate, end: endDate });
      formatPattern = "yyyy";
      break;
  }
  
  return intervals.map(intervalDate => {
    // Set up interval start/end for filtering visits
    let intervalStart: Date;
    let intervalEnd: Date;
    
    switch (period) {
      case "day":
        intervalStart = startOfDay(intervalDate);
        intervalEnd = endOfDay(intervalDate);
        break;
      case "week":
        intervalStart = startOfWeek(intervalDate);
        intervalEnd = endOfWeek(intervalDate);
        break;
      case "month":
        intervalStart = startOfMonth(intervalDate);
        intervalEnd = endOfMonth(intervalDate);
        break;
      case "year":
        intervalStart = startOfYear(intervalDate);
        intervalEnd = endOfYear(intervalDate);
        break;
    }
    
    // Filter visits in this interval
    const intervalVisits = visits.filter(visit => {
      const visitDate = parseISO(visit.visit_date);
      return !isBefore(visitDate, intervalStart) && !isAfter(visitDate, intervalEnd);
    });
    
    // Calculate total visitors for the interval
    const visitorCount = intervalVisits.reduce(
      (sum, visit) => sum + ((visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)),
      0
    );
    
    return {
      name: format(intervalDate, formatPattern),
      visitors: visitorCount
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
