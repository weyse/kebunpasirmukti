
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Edit, Trash, Download } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Visit } from '@/types/visit';
import { VisitTableHeader } from '@/components/visits/table/VisitTableHeader';
import { VisitTableEmptyState } from '@/components/visits/table/VisitTableEmptyState';
import { VisitTableLoadingState } from '@/components/visits/table/VisitTableLoadingState';
import { getActivityLabel } from '@/utils/visitHelpers';
import { exportVisitToExcel } from '@/utils/exportHelpers';

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
  const navigate = useNavigate();

  if (isLoading) {
    return <VisitTableLoadingState />;
  }

  if (filteredVisits.length === 0) {
    return <VisitTableEmptyState />;
  }

  const handleExportInvoice = (visit: Visit) => {
    exportVisitToExcel(visit);
  };

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
                  className={`${
                    visit.payment_status === 'lunas'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}
                >
                  {visit.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Buka menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            onClick={() => navigate(`/visits/view/${visit.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>Lihat semua detail kunjungan</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            onClick={() => navigate(`/visits/edit/${visit.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>Edit informasi kunjungan</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            onClick={() => handleExportInvoice(visit)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export Invoice
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>Unduh invoice dalam format Excel</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setVisitToDelete(visit)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent>Hapus data kunjungan</TooltipContent>
                      </Tooltip>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
