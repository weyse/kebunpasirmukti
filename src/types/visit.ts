
export type PaymentStatus = 'lunas' | 'belum_lunas';

export type Visit = {
  id: string;
  order_id: string;
  institution_name: string;
  responsible_person: string;
  visit_type: string;
  visit_date: string;
  payment_status: PaymentStatus;
  total_visitors: number;
  adult_count?: number;
  children_count?: number;
  teacher_count?: number;
  total_cost?: number;
  discount_percentage?: number;
  discounted_cost?: number;
  down_payment?: number;
  nights_count?: number; // Number of nights staying
};

// For dashboard data processing
export type VisitData = {
  id: string;
  institution_name: string;
  visit_date: string;
  adult_count?: number;
  children_count?: number;
  teacher_count?: number;
  total_cost?: number;
  payment_status?: PaymentStatus;
  order_id?: string;
};

// Dashboard types
export type DashboardMetrics = {
  totalVisits: number;
  totalVisitors: number;
  totalRevenue: number;
  monthlyGrowth: MonthlyGrowthData;
  monthlyVisits: {
    name: string;
    visitors: number;
  }[];
  upcomingVisits: UpcomingVisit[];
};

export type MonthlyGrowthData = {
  visits: number;
  visitors: number;
  revenue: number;
  monthlyVisits: {
    name: string;
    visitors: number;
  }[];
};

export type MonthlyVisitData = {
  month: string;
  count: number;
};

export type UpcomingVisit = {
  id: string;
  name: string;
  date: string;
  count: number;
};
