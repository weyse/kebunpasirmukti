
import React from 'react';
import { TableHead } from '@/components/ui/table';

interface VisitTableHeaderProps {
  field: string;
  label: string;
  sortField?: string;
  sortDirection?: string;
  handleSort?: (field: string) => void;
}

export const VisitTableHeader: React.FC<VisitTableHeaderProps> = ({ 
  field,
  label,
  sortField, 
  sortDirection, 
  handleSort 
}) => {
  // Helper function for sort icons
  const getSortIcon = () => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <TableHead 
      className={handleSort ? "cursor-pointer" : ""}
      onClick={() => handleSort && handleSort(field)}
    >
      {label} {getSortIcon()}
    </TableHead>
  );
};
