
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { toast } from 'sonner';
import { exportVisitInvoice } from './invoiceExport';
import { exportVisitsList } from './visitsListExport';

/**
 * Export visit data to Excel with professional invoice format
 */
export const exportVisitToExcel = (visit: Visit) => {
  try {
    if (!visit) {
      toast('Tidak dapat mengekspor invoice: data tidak lengkap');
      return;
    }

    // Call the dedicated invoice export function
    exportVisitInvoice(visit);
    
  } catch (error) {
    console.error('Error exporting invoice:', error);
    toast('Gagal mengekspor invoice');
  }
};

/**
 * Export all visits data to Excel - keep existing functionality
 */
export const exportAllVisitsToExcel = (visits: Visit[]) => {
  try {
    if (visits.length === 0) {
      toast('Tidak ada data untuk diekspor');
      return;
    }
    
    // Call the dedicated visits list export function
    exportVisitsList(visits);
    
  } catch (error) {
    console.error('Error exporting visits:', error);
    toast('Gagal mengekspor data');
  }
};
