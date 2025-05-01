
import React from 'react';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
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

interface DeleteVisitDialogProps {
  visitToDelete: Visit | null;
  setVisitToDelete: (visit: Visit | null) => void;
  handleDeleteVisit: () => void;
}

export function DeleteVisitDialog({
  visitToDelete,
  setVisitToDelete,
  handleDeleteVisit,
}: DeleteVisitDialogProps) {
  return (
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
          <AlertDialogAction onClick={handleDeleteVisit}>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
