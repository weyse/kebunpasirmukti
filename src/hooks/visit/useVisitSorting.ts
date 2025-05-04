
import { useState, useMemo } from 'react';
import { Visit } from '@/types/visit';

export const useVisitSorting = (visits: Visit[]) => {
  const [sortField, setSortField] = useState('visit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedVisits = useMemo(() => {
    return [...visits].sort((a, b) => {
      let valueA = a[sortField as keyof Visit] || '';
      let valueB = b[sortField as keyof Visit] || '';
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sortDirection === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
      }
    });
  }, [visits, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortField,
    sortDirection,
    sortedVisits,
    handleSort
  };
};
