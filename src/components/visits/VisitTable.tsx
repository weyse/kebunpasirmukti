
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Visit } from '@/types/visit';
import { VisitTableHeader } from '@/components/visits/table/VisitTableHeader';
import { VisitTableEmptyState } from '@/components/visits/table/VisitTableEmptyState';
import { VisitTableLoadingState } from '@/components/visits/table/VisitTableLoadingState';
import { VisitTableRowItem } from '@/components/visits/table/VisitTableRowItem';

interface VisitTableProps {
  visits: Visit[];
  filteredVisits: Visit[];
  isLoading: boolean;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
  setVisitToDelete: (visit: Visit | null) => void;
}

export function VisitTable({
  visits,
  filteredVisits,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  setVisitToDelete,
}: VisitTableProps) {
  if (isLoading) {
    return <VisitTableLoadingState />;
  }

  if (filteredVisits.length === 0) {
    return <VisitTableEmptyState />;
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <VisitTableHeader
              field="order_id"
              label="ID Pesanan"
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
            />
            <VisitTableHeader
              field="institution_name"
              label="Institusi/Grup"
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHead>Penanggung Jawab</TableHead>
            <VisitTableHeader
              field="visit_date"
              label="Tanggal Kunjungan"
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHead className="text-center">Jenis Kegiatan</TableHead>
            <TableHead className="text-center">Jumlah</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVisits.map((visit) => (
            <VisitTableRowItem
              key={visit.id}
              visit={visit}
              setVisitToDelete={setVisitToDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
