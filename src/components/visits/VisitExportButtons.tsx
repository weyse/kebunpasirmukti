
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const VisitExportButtons: React.FC = () => {
  // Export data
  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Data berhasil diekspor ke ${format.toUpperCase()}`, {
      description: `File telah diunduh ke komputer Anda`,
    });
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => handleExport('pdf')}>
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button variant="outline" onClick={() => handleExport('excel')}>
        <Download className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
    </div>
  );
};
