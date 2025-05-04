import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportAllVisitsToExcel, exportVisitToExcel } from '@/utils/export/exportHelpers';
import { Visit } from '@/types/visit';
import { toast } from 'sonner';

interface VisitExportButtonsProps {
  filteredVisits?: Visit[];
  singleVisit?: Visit;
  showSingleExport?: boolean;
}

export const VisitExportButtons: React.FC<VisitExportButtonsProps> = ({ 
  filteredVisits = [], 
  singleVisit,
  showSingleExport = false 
}) => {
  // Export data
  const handleExcelExport = () => {
    if (showSingleExport && singleVisit) {
      exportVisitToExcel(singleVisit);
      return;
    }
    
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
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export {showSingleExport ? 'Invoice' : 'Excel'}
      </Button>
    </div>
  );
};
