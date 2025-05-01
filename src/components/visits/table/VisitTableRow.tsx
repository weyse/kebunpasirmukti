
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Edit, Trash, FileText } from 'lucide-react';
import { Visit } from '@/types/visit';
import { Button } from '@/components/ui/button';
import {
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getActivityLabel } from '@/utils/visitHelpers';
import { exportVisitToExcel } from '@/utils/exportHelpers';

interface VisitTableRowProps {
  visit: Visit;
  setVisitToDelete?: (visit: Visit) => void;
}

export const VisitTableRow: React.FC<VisitTableRowProps> = ({ 
  visit, 
  setVisitToDelete 
}) => {
  const navigate = useNavigate();

  return (
    <TableRow>
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
          className={
            visit.payment_status === 'lunas'
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }
        >
          {visit.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate(`/guest-registration/view/${visit.id}`)}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Detail</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Detail</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate(`/guest-registration/edit/${visit.id}`)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => exportVisitToExcel(visit)}
              >
                <FileText className="h-4 w-4" />
                <span className="sr-only">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Excel</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => setVisitToDelete && setVisitToDelete(visit)}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};
