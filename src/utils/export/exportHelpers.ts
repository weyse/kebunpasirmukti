import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { toast } from 'sonner';
import { exportVisitInvoice } from './invoiceExport';
import { exportVisitsList } from './visitsListExport';
import { supabase } from '@/integrations/supabase/client';
import { processVisitData } from '@/hooks/visit/visitDataUtils';

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

/**
 * Export all visits as separate invoice sheets in a single Excel file (fetches from Supabase)
 */
export const exportAllVisitsInvoices = async () => {
  try {
    // Fetch all visits from Supabase
    const { data, error } = await supabase
      .from('guest_registrations')
      .select('*')
      .order('visit_date', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) {
      toast('Tidak ada data kunjungan untuk diekspor');
      return;
    }
    // Process data to Visit objects
    const visits = processVisitData(data);
    // Create a new workbook
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    // For each visit, create a sheet using exportVisitInvoice logic
    for (const visit of visits) {
      // Create a worksheet for this visit
      const ws = XLSX.utils.aoa_to_sheet([[]]);
      // Use the same logic as exportVisitInvoice to fill the worksheet
      // (We need to refactor exportVisitInvoice to allow worksheet injection, but for now, duplicate the logic)
      // Import the helpers from invoiceExport
      const { addProfessionalHeader, addInvoiceInfo, addServicesTable, addPaymentSummary, addFooter } = await import('./invoiceExport');
      const headerEndRow = addProfessionalHeader(ws);
      const infoEndRow = addInvoiceInfo(ws, visit, headerEndRow);
      const tableEndRow = addServicesTable(ws, visit, infoEndRow);
      const summaryEndRow = addPaymentSummary(ws, visit, tableEndRow);
      addFooter(ws, summaryEndRow);
      // Name the sheet with order_id or a fallback
      const sheetName = visit.order_id ? visit.order_id.replace(/[^a-zA-Z0-9]/g, '_') : `Visit_${visit.id}`;
      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31)); // Excel sheet name max 31 chars
    }
    // Save the workbook
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    XLSX.writeFile(wb, `semua-invoice-kunjungan-${currentDate}.xlsx`);
    toast('Semua invoice kunjungan berhasil diunduh sebagai file Excel');
  } catch (error) {
    console.error('Error exporting all invoices:', error);
    toast('Gagal mengekspor semua invoice');
  }
};
