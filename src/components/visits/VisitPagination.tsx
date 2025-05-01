
import React from 'react';
import { Button } from '@/components/ui/button';

interface VisitPaginationProps {
  filteredVisits: any[];
  totalVisits: number;
}

export const VisitPagination: React.FC<VisitPaginationProps> = ({
  filteredVisits,
  totalVisits,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredVisits.length} dari {totalVisits} kunjungan
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>
          Sebelumnya
        </Button>
        <Button variant="outline" size="sm" disabled>
          Selanjutnya
        </Button>
      </div>
    </div>
  );
};
