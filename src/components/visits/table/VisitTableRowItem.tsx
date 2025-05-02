
import React from 'react';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { TableCell, TableRow } from '@/components/ui/table';
import { VisitTableActions } from './VisitTableActions';
import { VisitStatusBadge } from './VisitStatusBadge';
import { getActivityLabel } from '@/utils/visitHelpers';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin } from 'lucide-react';

interface VisitTableRowItemProps {
  visit: Visit;
  setVisitToDelete: (visit: Visit | null) => void;
}

export function VisitTableRowItem({ visit, setVisitToDelete }: VisitTableRowItemProps) {
  // Function to safely format date
  const formatVisitDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString;
    }
  };

  // Check if visit has rooms or venues
  const hasRooms = visit.rooms_json && 
    visit.rooms_json.accommodation_counts && 
    Object.values(visit.rooms_json.accommodation_counts).some(count => (count as number) > 0);
    
  const hasVenues = visit.venues_json && 
    visit.venues_json.selected_venues && 
    visit.venues_json.selected_venues.length > 0;
  
  return (
    <TableRow>
      <TableCell className="font-medium">{visit.order_id || '-'}</TableCell>
      <TableCell>{visit.institution_name}</TableCell>
      <TableCell>{visit.responsible_person}</TableCell>
      <TableCell>
        {formatVisitDate(visit.visit_date)}
      </TableCell>
      <TableCell className="text-center">
        {getActivityLabel(visit.visit_type)}
      </TableCell>
      <TableCell className="text-center">{visit.total_visitors}</TableCell>
      <TableCell className="text-center">
        <div className="flex flex-col gap-1 items-center">
          <VisitStatusBadge status={visit.payment_status} />
          <div className="flex gap-1 mt-1">
            {hasRooms && (
              <Badge variant="outline" className="px-1 border-amber-500 text-amber-500">
                <Home className="h-3 w-3 mr-1" />
              </Badge>
            )}
            {hasVenues && (
              <Badge variant="outline" className="px-1 border-blue-500 text-blue-500">
                <MapPin className="h-3 w-3 mr-1" />
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <VisitTableActions 
          visit={visit} 
          setVisitToDelete={setVisitToDelete} 
        />
      </TableCell>
    </TableRow>
  );
}
