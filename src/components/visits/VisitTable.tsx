
import React from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Loader2 } from 'lucide-react';
import { Visit } from '@/types/visit';
import { getActivityLabel, getStatusInfo } from '@/utils/visitHelpers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface VisitTableProps {
  visits: Visit[];
  filteredVisits: Visit[];
  isLoading: boolean;
}

export const VisitTable: React.FC<VisitTableProps> = ({ filteredVisits, isLoading }) => {
  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID Pesanan</TableHead>
            <TableHead>
              <div className="flex items-center">
                Institusi/Grup
                <ArrowUpDown className="ml-2 h-3 w-3 cursor-pointer" />
              </div>
            </TableHead>
            <TableHead>Penanggung Jawab</TableHead>
            <TableHead>
              <div className="flex items-center">
                Tanggal Kunjungan
                <ArrowUpDown className="ml-2 h-3 w-3 cursor-pointer" />
              </div>
            </TableHead>
            <TableHead className="text-center">Jenis Kegiatan</TableHead>
            <TableHead className="text-center">Jumlah</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Memuat data...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredVisits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada data yang sesuai dengan filter
              </TableCell>
            </TableRow>
          ) : (
            filteredVisits.map((visit) => {
              const statusInfo = getStatusInfo(visit.payment_status);
              
              return (
                <TableRow key={visit.id}>
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
                    <Badge
                      variant="outline"
                      className={statusInfo.className}
                    >
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
