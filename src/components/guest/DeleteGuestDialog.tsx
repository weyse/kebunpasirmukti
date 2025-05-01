
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Guest {
  id: string;
  order_id: string;
  institution_name: string;
  visit_date: string;
  [key: string]: any;
}

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
    <Dialog open={!!guestToDelete} onOpenChange={(open) => !open && setGuestToDelete(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus data registrasi ini?
            <div className="mt-4 p-4 border rounded-md bg-muted">
              <p><strong>ID:</strong> {guestToDelete?.order_id}</p>
              <p><strong>Institusi:</strong> {guestToDelete?.institution_name}</p>
              <p><strong>Tanggal Kunjungan:</strong> {guestToDelete && format(new Date(guestToDelete.visit_date), 'dd MMMM yyyy')}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setGuestToDelete(null)}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteGuest}
          >
            Hapus Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
