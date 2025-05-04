
import { format, parseISO } from 'date-fns';
import { Visit } from '@/types/visit';

// Helper function to get visits for a specific date
export const getVisitsByDate = (date: Date, visits: Visit[]) => {
  return visits.filter(
    (visit) => format(parseISO(visit.visit_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );
};
