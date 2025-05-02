
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Visit } from '@/types/visit';
import { CalendarPermission } from '@/types/calendarPermission';
import { getActivityLabel, getActivityColor } from '@/utils/visitHelpers';

interface VisitDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  selectedVisits: Visit[];
  accessLevel?: CalendarPermission;
}

export const VisitDetailsDialog = ({ 
  open, 
  onOpenChange, 
  selectedDate, 
  selectedVisits,
  accessLevel = 'view'
}: VisitDetailsDialogProps) => {
  const navigate = useNavigate();
  const canEdit = accessLevel === 'admin' || accessLevel === 'edit';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Kunjungan pada {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy')}
          </DialogTitle>
          <DialogDescription>
            {selectedVisits.length} kunjungan terjadwal pada tanggal ini
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {selectedVisits.map((visit) => (
            <div key={visit.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{visit.institution_name}</h3>
                <Badge variant="outline" className={getActivityColor(visit.visit_type)}>
                  {getActivityLabel(visit.visit_type)}
                </Badge>
              </div>
              <div className="mt-2 space-y-2">
                <p className="text-sm"><strong>ID:</strong> {visit.order_id}</p>
                <p className="text-sm"><strong>Jumlah Pengunjung:</strong> {visit.total_visitors} orang</p>
                <p className="text-sm"><strong>Jenis Kegiatan:</strong> {getActivityLabel(visit.visit_type)}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant={canEdit ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/guest-registration/${canEdit ? 'edit' : 'view'}/${visit.id}`);
                  }}
                >
                  {canEdit ? 'Edit Detail' : 'Lihat Detail'}
                </Button>
              </div>
            </div>
          ))}
          
          {canEdit && (
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  if (selectedDate) {
                    // Navigate to registration page with pre-selected date
                    const dateParam = format(selectedDate, 'yyyy-MM-dd');
                    navigate(`/guest-registration/new?date=${dateParam}`);
                  } else {
                    navigate('/guest-registration/new');
                  }
                }}
              >
                Tambah Kunjungan Baru
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
