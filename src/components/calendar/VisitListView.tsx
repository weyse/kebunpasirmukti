
import { format, parseISO } from 'date-fns';
import { ChevronRight, Eye, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Visit } from '@/types/visit';
import { CalendarPermission } from '@/types/calendarPermission';
import { getActivityLabel, getActivityColor } from '@/utils/visitHelpers';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';

interface VisitListViewProps {
  visits: Visit[];
  onVisitClick: (visit: Visit) => void;
  accessLevel?: CalendarPermission;
}

export const VisitListView = ({ visits, onVisitClick, accessLevel = 'view' }: VisitListViewProps) => {
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()
  );
  
  const canEdit = accessLevel === 'admin' || accessLevel === 'edit';
  const navigate = useNavigate();
  
  const handleIconClick = (e: React.MouseEvent, visit: Visit) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    navigate(`/guest-registration/${canEdit ? 'edit' : 'view'}/${visit.id}`);
  };
  
  return (
    <div className="space-y-4">
      {sortedVisits.map((visit) => (
        <div 
          key={visit.id} 
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
          onClick={() => onVisitClick(visit)}
        >
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3 w-14 h-14">
              <div className="text-sm font-medium">{format(parseISO(visit.visit_date), 'dd')}</div>
              <div className="text-xs">{format(parseISO(visit.visit_date), 'MMM')}</div>
            </div>
            <div>
              <h3 className="font-medium">{visit.institution_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getActivityColor(visit.visit_type)}>
                  {getActivityLabel(visit.visit_type)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {visit.total_visitors} pengunjung
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canEdit ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={(e) => handleIconClick(e, visit)}
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Kunjungan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={(e) => handleIconClick(e, visit)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lihat Detail</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      ))}
      
      {visits.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Tidak ada kunjungan yang terjadwal
        </div>
      )}
    </div>
  );
};
