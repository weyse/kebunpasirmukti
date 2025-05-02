
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash, Download } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Visit } from '@/types/visit';
import { exportVisitToExcel } from '@/utils/exportHelpers';

interface VisitTableActionsProps {
  visit: Visit;
  setVisitToDelete: (visit: Visit | null) => void;
}

export function VisitTableActions({ visit, setVisitToDelete }: VisitTableActionsProps) {
  const navigate = useNavigate();

  const handleExportInvoice = (visit: Visit) => {
    exportVisitToExcel(visit);
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Buka menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={() => navigate(`/guest-registration/view/${visit.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>Lihat semua detail kunjungan</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={() => navigate(`/guest-registration/edit/${visit.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>Edit informasi kunjungan</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={() => handleExportInvoice(visit)}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Invoice
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>Unduh invoice dalam format Excel</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setVisitToDelete(visit)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent>Hapus data kunjungan</TooltipContent>
          </Tooltip>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
