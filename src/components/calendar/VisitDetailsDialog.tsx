
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
import { Home, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  
  // Function to count total rooms
  const getTotalRooms = (visit: Visit) => {
    if (!visit.rooms_json || !visit.rooms_json.accommodation_counts) {
      return 0;
    }
    
    // Safely sum the accommodation counts
    return Object.values(visit.rooms_json.accommodation_counts).reduce(
      (sum, count) => sum + (Number(count) || 0), 0
    );
  };
  
  // Function to count total venues
  const getTotalVenues = (visit: Visit) => {
    if (!visit.venues_json || !visit.venues_json.selected_venues) {
      return 0;
    }
    
    return visit.venues_json.selected_venues.length;
  };
  
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
                
                {(getTotalRooms(visit) > 0 || getTotalVenues(visit) > 0) && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getTotalRooms(visit) > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-500">
                          <Home className="h-3 w-3" />
                          <span>{getTotalRooms(visit)} kamar</span>
                        </Badge>
                      )}
                      
                      {getTotalVenues(visit) > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-500">
                          <MapPin className="h-3 w-3" />
                          <span>{getTotalVenues(visit)} venue</span>
                        </Badge>
                      )}
                    </div>
                  </>
                )}
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
