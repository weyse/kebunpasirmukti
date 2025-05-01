
import React from 'react';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { TableCell, TableRow } from '@/components/ui/table';
import { VisitTableActions } from './VisitTableActions';
import { VisitStatusBadge } from './VisitStatusBadge';
import { getActivityLabel } from '@/utils/visitHelpers';

interface VisitTableRowItemProps {
  visit: Visit;
  setVisitToDelete: (visit: Visit | null) => void;
}

export function VisitTableRowItem({ visit, setVisitToDelete }: VisitTableRowItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{visit.order_id}</TableCell>
      <TableCell>{visit.institution_name}</TableCell>
      <TableCell>{visit.responsible_person}</TableCell>
      <TableCell>
        {format(new Date(visit.visit_date), 'dd MMM yyyy')}
      </TableCell>
      <TableCell className="text-center">
        {getActivityLabel(visit.visit_type)}
      </TableCell>
      <TableCell className="text-center">{visit.total_visitors}</TableCell>
      <TableCell className="text-center">
        <VisitStatusBadge status={visit.payment_status} />
      </TableCell>
      <TableCell className="text-right">
        <VisitTableActions 
          visit={visit} 
          setVisitToDelete={setVisitToDelete} 
        />
      </TableCell>
    </TableRow>
  );
}
