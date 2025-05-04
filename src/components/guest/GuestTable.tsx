import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowUpDown, Eye, Edit, CalendarCheck, Trash, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { exportVisitToExcel } from '@/utils/exportHelpers';

// Define guest data types
type PaymentStatus = 'belum_lunas' | 'lunas';

type Guest = {
  id: string;
  order_id: string;
  responsible_person: string;
  institution_name: string;
  phone_number: string;
  total_visitors: number;
  visit_type: string;
  package_type: string;
  visit_date: string;
  payment_status: PaymentStatus;
  created_at: string;
  adult_count?: number;
  children_count?: number;
  teacher_count?: number;
  total_cost?: number;
  discount_percentage?: number;
  discounted_cost?: number;
  down_payment?: number;
  rooms_json?: string;
  venues_json?: string;
  nights_count?: number;
  extra_bed_counts?: number;
};

interface GuestTableProps {
  guests: Guest[];
  filteredGuests: Guest[];
  isLoading: boolean;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
  setGuestToDelete: (guest: Guest | null) => void;
}

export function GuestTable({
  guests,
  filteredGuests,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  setGuestToDelete,
}: GuestTableProps) {
  const navigate = useNavigate();

  // Helper function for activity type labels
  const getActivityLabel = (type: string): string => {
    const labels: Record<string, string> = {
      wisata_edukasi: 'Wisata Edukasi',
      outbound: 'Outbound',
      camping: 'Camping',
      field_trip: 'Field Trip',
      penelitian: 'Penelitian',
      lainnya: 'Lainnya',
    };
    return labels[type] || type;
  };

  // Helper function for package type labels
  const getPackageLabel = (type: string): string => {
    const packageLabels: Record<string, string> = {
      agropintar: 'Agropintar',
      agro_junior: 'Agro Junior',
      kemping: 'Kemping',
      funtastic: 'Funtastic',
      ekstrakurikuler: 'Ekstrakurikuler',
      ceria_outdoor: 'Ceria Outdoor',
      ceria_indoor: 'Ceria Indoor',
      lansia: 'Lansia 60+',
      corporate: 'Corporate',
      seminar_sehari: 'Seminar Sehari',
      seminar_inap_biasa: 'Seminar Inap Biasa',
      seminar_inap_religi: 'Seminar Inap Religi',
    };
    return packageLabels[type] || type;
  };

  const handleExportToExcel = (guest: Guest) => {
    // Convert guest to Visit type
    const visit = {
      id: guest.id,
      order_id: guest.order_id,
      institution_name: guest.institution_name,
      responsible_person: guest.responsible_person,
      visit_type: guest.visit_type,
      visit_date: guest.visit_date,
      payment_status: guest.payment_status,
      total_visitors: guest.total_visitors,
      adult_count: guest.adult_count,
      children_count: guest.children_count,
      teacher_count: guest.teacher_count,
      total_cost: guest.total_cost,
      discount_percentage: guest.discount_percentage,
      discounted_cost: guest.discounted_cost,
      down_payment: guest.down_payment,
      rooms_json: typeof guest.rooms_json === 'string' ? JSON.parse(guest.rooms_json) : guest.rooms_json,
      venues_json: typeof guest.venues_json === 'string' ? JSON.parse(guest.venues_json) : guest.venues_json,
      nights_count: guest.nights_count,
    };
    console.log('Exporting visit to Excel:', visit);
    // Export the invoice using the new function
    exportVisitToExcel(visit);
  };

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID Pesanan</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('institution_name')}>
                Institusi/Grup
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Penanggung Jawab</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('visit_date')}>
                Tanggal Kunjungan
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="text-center">Jenis Kegiatan</TableHead>
            <TableHead className="text-center">Paket</TableHead>
            <TableHead className="text-center">Jumlah</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-pasirmukti-500 mr-2" />
                  <span>Memuat data...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredGuests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Tidak ada data yang sesuai dengan filter
              </TableCell>
            </TableRow>
          ) : (
            filteredGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.order_id || '-'}</TableCell>
                <TableCell>{guest.institution_name}</TableCell>
                <TableCell>{guest.responsible_person}</TableCell>
                <TableCell>
                  {format(new Date(guest.visit_date), 'dd MMM yyyy')}
                </TableCell>
                <TableCell className="text-center">
                  {getActivityLabel(guest.visit_type)}
                </TableCell>
                <TableCell className="text-center">
                  {getPackageLabel(guest.package_type)}
                </TableCell>
                <TableCell className="text-center">{guest.total_visitors}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`${
                      guest.payment_status === 'lunas'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    {guest.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
                      <DropdownMenuItem
                        onClick={() => navigate(`/guest-registration/view/${guest.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/guest-registration/edit/${guest.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/check-in/${guest.id}`)}
                      >
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        Check-In
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportToExcel(guest)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setGuestToDelete(guest)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
