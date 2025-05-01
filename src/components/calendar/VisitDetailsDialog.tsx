
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
import { getActivityLabel, getActivityColor } from '@/utils/visitHelpers';

interface VisitDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  selectedVisits: Visit[];
}

export const VisitDetailsDialog = ({ 
  open, 
  onOpenChange, 
  selectedDate, 
  selectedVisits 
}: VisitDetailsDialogProps) => {
  const navigate = useNavigate();
  
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
                <Button variant="outline" size="sm" onClick={() => navigate(`/guest-registration/${visit.id}`)}>
                  Lihat Detail
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
