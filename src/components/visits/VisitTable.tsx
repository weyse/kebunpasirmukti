
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Loader2, Edit, Trash, FileExcel } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

interface VisitTableProps {
  visits: Visit[];
  filteredVisits: Visit[];
  isLoading: boolean;
}

export const VisitTable: React.FC<VisitTableProps> = ({ filteredVisits, isLoading }) => {
  const navigate = useNavigate();
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleEdit = (visitId: string) => {
    navigate(`/guest-registration/edit/${visitId}`);
  };
  
  const openDeleteDialog = (visit: Visit) => {
    setVisitToDelete(visit);
  };
  
  const handleDelete = async () => {
    if (!visitToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('guest_registrations')
        .delete()
        .eq('id', visitToDelete.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Data kunjungan berhasil dihapus', {
        description: `ID: ${visitToDelete.order_id}`
      });
      
      // Reload the page after deletion
      window.location.reload();
    } catch (error) {
      console.error('Error deleting visit:', error);
      toast.error('Gagal menghapus data', {
        description: 'Terjadi kesalahan saat menghapus data kunjungan.'
      });
    } finally {
      setIsDeleting(false);
      setVisitToDelete(null);
    }
  };
  
  const exportToExcel = (visit: Visit) => {
    // Create a worksheet with the single visit data
    const worksheet = XLSX.utils.json_to_sheet([
      {
        'ID Pesanan': visit.order_id,
        'Institusi/Grup': visit.institution_name,
        'Penanggung Jawab': visit.responsible_person,
        'Tanggal Kunjungan': format(new Date(visit.visit_date), 'dd/MM/yyyy'),
        'Jenis Kegiatan': getActivityLabel(visit.visit_type),
        'Jumlah Pengunjung': visit.total_visitors,
        'Status Pembayaran': visit.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'
      }
    ]);
    
    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kunjungan');
    
    // Generate Excel file and download
    XLSX.writeFile(workbook, `Kunjungan_${visit.order_id}.xlsx`);
    
    toast.success('Data berhasil diekspor', {
      description: `File telah diunduh ke komputer Anda`
    });
  };

  return (
    <>
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
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => handleEdit(visit.id)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit data</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => exportToExcel(visit)}>
                              <FileExcel className="h-4 w-4" />
                              <span className="sr-only">Export Excel</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Export ke Excel</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => openDeleteDialog(visit)}>
                              <Trash className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hapus data</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!visitToDelete} onOpenChange={(open) => !open && setVisitToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data kunjungan ini?
              {visitToDelete && (
                <div className="mt-4 p-4 border rounded-md bg-muted">
                  <p><strong>ID:</strong> {visitToDelete.order_id}</p>
                  <p><strong>Institusi:</strong> {visitToDelete.institution_name}</p>
                  <p><strong>Tanggal Kunjungan:</strong> {format(new Date(visitToDelete.visit_date), 'dd MMMM yyyy')}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisitToDelete(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Menghapus...
                </>
              ) : (
                'Hapus Data'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
