
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
