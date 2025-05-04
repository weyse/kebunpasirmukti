
import React from 'react';
import {
  TableCell,
  TableRow,
} from '@/components/ui/table';

export const VisitTableEmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
        Tidak ada data kunjungan yang sesuai dengan filter
      </TableCell>
    </TableRow>
  );
};
