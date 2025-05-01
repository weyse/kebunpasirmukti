
// Define visit data types
export type Visit = {
  id: string;
  order_id: string;
  institution_name: string;
  responsible_person: string;
  total_visitors: number;
  visit_type: string;
  visit_date: string;
  payment_status: 'lunas' | 'belum_lunas';
};

// Dashboard data types
export type MonthlyVisitData = {
  name: string; // Month name
  visitors: number;
};

export type UpcomingVisit = {
  id: string;
  name: string;
  date: string;
  count: number;
};

export type DashboardMetrics = {
  totalVisits: number;
  totalVisitors: number;
  totalRevenue: number;
  monthlyGrowth: {
    visits: number;
    visitors: number;
    revenue: number;
  };
  monthlyVisits: MonthlyVisitData[];
  upcomingVisits: UpcomingVisit[];
};
