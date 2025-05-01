
import React from 'react';
import { FileExcel, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportAllVisitsToExcel } from '@/utils/exportHelpers';
import { Visit } from '@/types/visit';
import { toast } from 'sonner';

interface VisitExportButtonsProps {
  filteredVisits?: Visit[];
}

export const VisitExportButtons: React.FC<VisitExportButtonsProps> = ({ filteredVisits = [] }) => {
  // Export data
  const handleExcelExport = () => {
    if (filteredVisits.length === 0) {
      toast('Tidak ada data untuk diekspor');
      return;
    }
    
    exportAllVisitsToExcel(filteredVisits);
  };

  const handlePdfExport = () => {
    toast('Fitur export PDF akan segera tersedia', {
      description: 'Silakan gunakan export Excel untuk saat ini'
    });
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handlePdfExport}>
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button variant="outline" onClick={handleExcelExport}>
        <FileExcel className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
    </div>
  );
};
