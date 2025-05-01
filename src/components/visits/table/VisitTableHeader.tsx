
import React from 'react';
import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VisitTableHeaderProps {
  sortField?: string;
  sortDirection?: string;
  handleSort?: (field: string) => void;
}

export const VisitTableHeader: React.FC<VisitTableHeaderProps> = ({ 
  sortField, 
  sortDirection, 
  handleSort 
}) => {
  // Helper function for sort icons
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className={handleSort ? "cursor-pointer" : ""}
          onClick={() => handleSort && handleSort('order_id')}
        >
          ID Pesanan {getSortIcon('order_id')}
        </TableHead>
        <TableHead
          className={handleSort ? "cursor-pointer" : ""}
          onClick={() => handleSort && handleSort('institution_name')}
        >
          Institusi {getSortIcon('institution_name')}
        </TableHead>
        <TableHead
          className={handleSort ? "cursor-pointer" : ""}
          onClick={() => handleSort && handleSort('responsible_person')}
        >
          Penanggung Jawab {getSortIcon('responsible_person')}
        </TableHead>
        <TableHead 
          className={`${handleSort ? "cursor-pointer" : ""}`}
          onClick={() => handleSort && handleSort('visit_date')}
        >
          Tanggal Kunjungan {getSortIcon('visit_date')}
        </TableHead>
        <TableHead className="text-center">Jenis Kegiatan</TableHead>
        <TableHead className="text-center">Jumlah</TableHead>
        <TableHead className="text-center">Status</TableHead>
        <TableHead className="text-right">Aksi</TableHead>
      </TableRow>
    </TableHeader>
  );
};
