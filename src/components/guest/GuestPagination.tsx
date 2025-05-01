
import React from 'react';
import { Button } from '@/components/ui/button';

interface GuestPaginationProps {
  filteredGuests: any[];
  totalGuests: number;
}

export function GuestPagination({ filteredGuests, totalGuests }: GuestPaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredGuests.length} dari {totalGuests} registrasi
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
}
