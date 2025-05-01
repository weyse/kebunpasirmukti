
import { format, parseISO } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Visit } from '@/types/visit';
import { getActivityLabel, getActivityColor } from '@/utils/visitHelpers';

interface VisitListViewProps {
  visits: Visit[];
  onVisitClick: (visit: Visit) => void;
}

export const VisitListView = ({ visits, onVisitClick }: VisitListViewProps) => {
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()
  );
  
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
              <div className="flex items-center mt-1">
                <Badge variant="outline" className={getActivityColor(visit.visit_type)}>
                  {getActivityLabel(visit.visit_type)}
                </Badge>
                <span className="ml-2 text-sm text-muted-foreground">
                  {visit.total_visitors} pengunjung
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
