
import React from 'react';
import { format } from 'date-fns';
import { Guest } from '@/hooks/useGuestData';
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

interface DeleteGuestDialogProps {
  guestToDelete: Guest | null;
  setGuestToDelete: (guest: Guest | null) => void;
  handleDeleteGuest: () => void;
}

export function DeleteGuestDialog({
  guestToDelete,
  setGuestToDelete,
  handleDeleteGuest,
}: DeleteGuestDialogProps) {
  return (
    <AlertDialog open={!!guestToDelete} onOpenChange={(open) => !open && setGuestToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus Data</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data registrasi ini?
            <div className="mt-4 p-4 border rounded-md bg-muted">
              <p><strong>ID:</strong> {guestToDelete?.order_id}</p>
              <p><strong>Institusi:</strong> {guestToDelete?.institution_name}</p>
              <p><strong>Tanggal:</strong> {guestToDelete && format(new Date(guestToDelete.visit_date), 'dd MMM yyyy')}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteGuest}>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
