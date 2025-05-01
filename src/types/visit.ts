
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
};

// Dashboard types
export type DashboardMetrics = {
  totalVisits: number;
  upcomingVisits: number;
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
};

export type MonthlyVisitData = {
  month: string;
  count: number;
};

export type UpcomingVisit = {
  id: string;
  institution_name: string;
  visit_date: string;
  total_visitors: number;
};
