
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Edit, Trash, Download } from 'lucide-react';
import { Visit } from '@/types/visit';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

interface VisitTableProps {
  visits: Visit[];
  filteredVisits: Visit[];
  isLoading: boolean;
}

export function VisitTable({ visits, filteredVisits, isLoading }: VisitTableProps) {
  const navigate = useNavigate();
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);

  const handleDelete = async () => {
    if (!visitToDelete) return;
    
    try {
      const { error } = await supabase
        .from('guest_registrations')
        .delete()
        .eq('id', visitToDelete.id);
      
      if (error) throw error;
      
      // Show success toast
      toast({
        title: 'Kunjungan berhasil dihapus',
        description: `ID: ${visitToDelete.order_id}`,
      });
      
      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting visit:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus data kunjungan',
        variant: 'destructive',
      });
    } finally {
      setVisitToDelete(null);
    }
  };
  
  const exportToExcel = (visit: Visit) => {
    // Create a worksheet from the single visit data
    const worksheet = XLSX.utils.json_to_sheet([{
      ID: visit.order_id,
      'Institusi': visit.institution_name,
      'Penanggung Jawab': visit.responsible_person,
      'Tanggal Kunjungan': format(new Date(visit.visit_date), 'dd MMM yyyy'),
      'Jenis Kegiatan': getActivityLabel(visit.visit_type),
      'Jumlah Peserta': visit.total_visitors,
      'Status Pembayaran': visit.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'
    }]);
    
    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kunjungan');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `kunjungan-${visit.order_id || visit.id}.xlsx`);
    
    toast({
      title: 'Export berhasil',
      description: 'Data telah diunduh sebagai file Excel'
    });
  };
  
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

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Pesanan</TableHead>
            <TableHead>Institusi</TableHead>
            <TableHead>Penanggung Jawab</TableHead>
            <TableHead>Tanggal Kunjungan</TableHead>
            <TableHead className="text-center">Jenis Kegiatan</TableHead>
            <TableHead className="text-center">Jumlah</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                <div className="flex justify-center items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Memuat data...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredVisits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                Tidak ada data kunjungan yang sesuai dengan filter
              </TableCell>
            </TableRow>
          ) : (
            filteredVisits.map((visit) => (
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
                    className={
                      visit.payment_status === 'lunas'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }
                  >
                    {visit.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/guest-registration/view/${visit.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Detail</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Detail</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/guest-registration/edit/${visit.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => exportToExcel(visit)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Export</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export Excel</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => setVisitToDelete(visit)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <AlertDialog open={!!visitToDelete} onOpenChange={(open) => !open && setVisitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Data</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data kunjungan ini?
              <div className="mt-4 p-4 border rounded-md bg-muted">
                <p><strong>ID:</strong> {visitToDelete?.order_id}</p>
                <p><strong>Institusi:</strong> {visitToDelete?.institution_name}</p>
                <p><strong>Tanggal:</strong> {visitToDelete && format(new Date(visitToDelete.visit_date), 'dd MMM yyyy')}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
