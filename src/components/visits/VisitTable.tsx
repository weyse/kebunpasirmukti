
import React from 'react';
import { Visit } from '@/types/visit';
import {
  Table,
  TableBody,
} from '@/components/ui/table';
import { VisitTableHeader } from './table/VisitTableHeader';
import { VisitTableRow } from './table/VisitTableRow';
import { VisitTableLoadingState } from './table/VisitTableLoadingState';
import { VisitTableEmptyState } from './table/VisitTableEmptyState';

interface VisitTableProps {
  visits: Visit[];
  filteredVisits: Visit[];
  isLoading: boolean;
  sortField?: string;
  sortDirection?: string;
  handleSort?: (field: string) => void;
  setVisitToDelete?: (visit: Visit) => void;
}

export function VisitTable({ 
  visits, 
  filteredVisits, 
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  setVisitToDelete
}: VisitTableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <VisitTableHeader 
          sortField={sortField} 
          sortDirection={sortDirection} 
          handleSort={handleSort} 
        />
        <TableBody>
          {isLoading ? (
            <VisitTableLoadingState />
          ) : filteredVisits.length === 0 ? (
            <VisitTableEmptyState />
          ) : (
            filteredVisits.map((visit) => (
              <VisitTableRow 
                key={visit.id}
                visit={visit}
                setVisitToDelete={setVisitToDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
