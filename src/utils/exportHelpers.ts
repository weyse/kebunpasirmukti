
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { getActivityLabel } from '@/utils/visitHelpers';
import { toast } from 'sonner';

// Format currency to Indonesian Rupiah format
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Function to get package type label
export const getPackageLabel = (type: string): string => {
  const packageLabels: Record<string, string> = {
    agropintar: 'Agropintar',
    agro_junior: 'Agro Junior',
    kemping: 'Kemping',
    funtastic: 'Funtastic',
    ekstrakurikuler: 'Ekstrakurikuler',
    ceria_outdoor: 'Ceria Outdoor',
    ceria_indoor: 'Ceria Indoor',
    lansia: 'Lansia 60+',
    corporate: 'Corporate',
    seminar_sehari: 'Seminar Sehari',
    seminar_inap_biasa: 'Seminar Inap Biasa',
    seminar_inap_religi: 'Seminar Inap Religi',
  };
  return packageLabels[type] || type;
};

// Generate border style for Excel cells
const borderStyle = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' }
};

// Add header section to worksheet
const addHeaderToWorksheet = (ws: XLSX.WorkSheet, visit: Visit) => {
  // Company header data
  const headerData = [
    ['PASIR MUKTI AGROEDUTOURISM', '', '', '', '', ''],
    ['Jl. Pasir Mukti Citeureup, Kab. Bogor', '', '', '', '', ''],
    ['Telp: 0812-8007-7879', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['INVOICE', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['Kepada Yth:', '', '', 'Tanggal:', format(new Date(), 'dd MMM yy'), ''],
    [visit.responsible_person, '', '', 'No. Invoice:', `${visit.order_id.substring(0, 8)}/in`, ''],
    [visit.institution_name, '', '', 'Tgl Kunjungan:', format(new Date(visit.visit_date), 'dd MMM yy'), ''],
    ['', '', '', '', '', ''],
  ];

  // Add header data to worksheet
  headerData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      ws[cellRef] = { v: cell, t: 's' };
      
      // Apply borders to all cells
      if (!ws['!cols']) ws['!cols'] = [];
      if (!ws['!rows']) ws['!rows'] = [];
      
      // Set column width
      if (!ws['!cols'][colIndex]) {
        ws['!cols'][colIndex] = { wch: 20 };
      }
    });
  });

  // Merge cells for header titles
  const headerMerges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // Address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // Phone
    { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } }, // INVOICE
  ];

  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'] = [...ws['!merges'], ...headerMerges];

  // Return last row index
  return headerData.length;
};

// Add invoice details to worksheet
const addInvoiceDetailsToWorksheet = (
  ws: XLSX.WorkSheet, 
  visit: Visit, 
  startRow: number
): number => {
  // Details header
  const detailsHeader = [
    ['Tanggal', 'Deskripsi', 'Harga', 'Satuan', 'Jumlah', 'Total'],
  ];
  
  // Add details header
  detailsHeader.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: startRow + rowIndex, c: colIndex });
      ws[cellRef] = { 
        v: cell, 
        t: 's',
        s: { 
          font: { bold: true },
          alignment: { horizontal: 'center' },
          border: borderStyle
        } 
      };
    });
  });
  
  // Calculate costs
  const adultCost = visit.adult_count ? visit.adult_count * 100000 : 0;
  const childrenCost = visit.children_count ? visit.children_count * 70000 : 0;
  const teacherCost = visit.teacher_count ? visit.teacher_count * 50000 : 0;
  const accommodationCost = visit.nights_count ? visit.nights_count * 1250000 : 0;
  
  // Current row after header
  let currentRow = startRow + detailsHeader.length;
  
  // Format date for details
  const visitDate = format(new Date(visit.visit_date), 'dd-MM-yy');
  
  // Add package description row
  const packageRow = [
    [visitDate, `Paket: ${getPackageLabel(visit.visit_type || 'agropintar').toUpperCase()}`, '', '', '', ''],
    ['', 'Peserta', '', '', '', ''],
  ];
  
  packageRow.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: currentRow + rowIndex, c: colIndex });
      ws[cellRef] = { 
        v: cell, 
        t: 's',
        s: { border: borderStyle } 
      };
    });
  });
  
  currentRow += packageRow.length;
  
  // Add participant details
  const participantDetails = [];
  
  if (visit.children_count && visit.children_count > 0) {
    participantDetails.push(['', 'Anak', '70,000', 'per orang', visit.children_count, formatCurrency(childrenCost).replace('Rp ', '')]);
  }
  
  if (visit.adult_count && visit.adult_count > 0) {
    participantDetails.push(['', 'Dewasa', '100,000', 'per orang', visit.adult_count, formatCurrency(adultCost).replace('Rp ', '')]);
  }
  
  if (visit.teacher_count && visit.teacher_count > 0) {
    participantDetails.push(['', 'Guru', '50,000', 'per orang', visit.teacher_count, formatCurrency(teacherCost).replace('Rp ', '')]);
  }
  
  // Add accommodation if applicable
  if (visit.nights_count && visit.nights_count > 0) {
    participantDetails.push(['', 'Akomodasi', '', '', '', '']);
    participantDetails.push(['', 'Pondok Kopel', 'Rp 1.250.000', 'per kamar', '2 kamar', '2.500.000']);
    participantDetails.push(['', '  - Semangka 1', '', '', '', '']);
    participantDetails.push(['', '  - Semangka 2', '', '', '', '']);
    participantDetails.push(['', 'Durasi menginap', '', '', `${visit.nights_count} malam`, '']);
  }
  
  // Add extrabed if applicable (example)
  if (visit.total_cost && visit.total_cost > (adultCost + childrenCost + teacherCost + accommodationCost)) {
    const extraBedCost = 140000 * (visit.children_count || 0);
    participantDetails.push(['', 'Extrabed Anak', 'Rp 140.000', 'per orang', visit.children_count, formatCurrency(extraBedCost).replace('Rp ', '')]);
  }
  
  // Add participant details to worksheet
  participantDetails.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: currentRow + rowIndex, c: colIndex });
      ws[cellRef] = { 
        v: cell, 
        t: colIndex === 4 || (colIndex === 5 && typeof cell === 'number') ? 'n' : 's',
        s: { border: borderStyle } 
      };
    });
  });
  
  currentRow += participantDetails.length;
  
  // Add summary totals
  const baseTotal = visit.total_cost || (adultCost + childrenCost + teacherCost);
  const discountAmount = visit.discount_percentage ? (baseTotal * (visit.discount_percentage / 100)) : 0;
  const discountedTotal = visit.discounted_cost || baseTotal - discountAmount;
  const downPayment = visit.down_payment || 0;
  const remainingBalance = discountedTotal - downPayment;
  
  const summaryRows = [
    ['', '', '', '', 'Total Biaya Dasar', formatCurrency(baseTotal).replace('Rp ', '')],
  ];
  
  if (visit.discount_percentage && visit.discount_percentage > 0) {
    summaryRows.push(['', '', '', '', `Diskon Paket (${visit.discount_percentage}%)`, `- ${formatCurrency(discountAmount).replace('Rp ', '')}`]);
    summaryRows.push(['', '', '', '', 'Total Setelah Diskon', formatCurrency(discountedTotal).replace('Rp ', '')]);
  }
  
  if (visit.down_payment && visit.down_payment > 0) {
    summaryRows.push(['', '', '', '', 'DP (Transfer)', `- ${formatCurrency(downPayment).replace('Rp ', '')}`]);
  }
  
  summaryRows.push(['', '', '', '', 'Sisa Yang Harus Dibayar', formatCurrency(remainingBalance).replace('Rp ', '')]);
  
  // Add empty row
  summaryRows.push(['', '', '', '', '', '']);
  
  // Add note
  summaryRows.push(['(Periksa dahulu sebelum membayar)', '', '', '', '', '']);
  
  // Add thank you note
  summaryRows.push(['', '', '', '', '', '']);
  summaryRows.push(['TERIMA KASIH ATAS KEPERCAYAAN ANDA', '', '', '', '', '']);
  summaryRows.push(['PASIR MUKTI AGROEDUTOURISM', '', '', '', '', '']);
  
  // Add summary rows to worksheet
  summaryRows.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: currentRow + rowIndex, c: colIndex });
      ws[cellRef] = { 
        v: cell, 
        t: 's',
        s: { 
          font: { bold: colIndex >= 4 },
          border: rowIndex < summaryRows.length - 3 ? borderStyle : undefined
        } 
      };
    });
  });
  
  // Merge cells for notes and thank you
  const noteMerges = [
    { s: { r: currentRow + summaryRows.length - 3, c: 0 }, e: { r: currentRow + summaryRows.length - 3, c: 5 } },
    { s: { r: currentRow + summaryRows.length - 1, c: 0 }, e: { r: currentRow + summaryRows.length - 1, c: 5 } }
  ];
  
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'] = [...ws['!merges'], ...noteMerges];
  
  return currentRow + summaryRows.length;
};

// Export visit data to Excel with invoice format
export const exportVisitToExcel = (visit: Visit) => {
  try {
    // Create new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[]]);
    
    // Add header section
    const headerEndRow = addHeaderToWorksheet(ws, visit);
    
    // Add invoice details section
    addInvoiceDetailsToWorksheet(ws, visit, headerEndRow);
    
    // Set print area
    ws['!print'] = { area: "A1:F50" };
    
    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
    
    // Generate Excel file with current date in filename
    const currentDate = format(new Date(), 'yyyyMMdd');
    XLSX.writeFile(wb, `invoice-${visit.order_id || visit.id}-${currentDate}.xlsx`);
    
    toast('Invoice berhasil diunduh sebagai file Excel');
  } catch (error) {
    console.error('Error exporting invoice:', error);
    toast('Gagal mengekspor invoice');
  }
};

// Export all visits data to Excel
export const exportAllVisitsToExcel = (visits: Visit[]) => {
  try {
    if (visits.length === 0) {
      toast('Tidak ada data untuk diekspor');
      return;
    }
    
    // Prepare data with more details
    const data = visits.map(visit => ({
      ID_Pesanan: visit.order_id,
      Institusi: visit.institution_name,
      Penanggung_Jawab: visit.responsible_person,
      Tanggal_Kunjungan: format(new Date(visit.visit_date), 'dd MMM yyyy'),
      Jenis_Kegiatan: getActivityLabel(visit.visit_type),
      Jumlah_Pengunjung: visit.total_visitors,
      Jumlah_Dewasa: visit.adult_count || 0,
      Jumlah_Anak: visit.children_count || 0,
      Jumlah_Guru: visit.teacher_count || 0,
      Status_Pembayaran: visit.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas',
      Total_Biaya: formatCurrency(visit.total_cost),
      Diskon: visit.discount_percentage ? `${visit.discount_percentage}%` : '0%',
      Biaya_Setelah_Diskon: formatCurrency(visit.discounted_cost),
      Uang_Muka: formatCurrency(visit.down_payment),
      Sisa_Pembayaran: formatCurrency((visit.discounted_cost || 0) - (visit.down_payment || 0)),
      Tanggal_Ekspor: format(new Date(), 'dd MMM yyyy HH:mm:ss')
    }));
    
    // Column definitions
    const columns = [
      { header: 'ID Pesanan', key: 'ID_Pesanan' },
      { header: 'Institusi', key: 'Institusi' },
      { header: 'Penanggung Jawab', key: 'Penanggung_Jawab' },
      { header: 'Tanggal Kunjungan', key: 'Tanggal_Kunjungan' },
      { header: 'Jenis Kegiatan', key: 'Jenis_Kegiatan' },
      { header: 'Jumlah Pengunjung', key: 'Jumlah_Pengunjung' },
      { header: 'Jumlah Dewasa', key: 'Jumlah_Dewasa' },
      { header: 'Jumlah Anak', key: 'Jumlah_Anak' },
      { header: 'Jumlah Guru', key: 'Jumlah_Guru' },
      { header: 'Status Pembayaran', key: 'Status_Pembayaran' },
      { header: 'Total Biaya', key: 'Total_Biaya' },
      { header: 'Diskon', key: 'Diskon' },
      { header: 'Biaya Setelah Diskon', key: 'Biaya_Setelah_Diskon' },
      { header: 'Uang Muka', key: 'Uang_Muka' },
      { header: 'Sisa Pembayaran', key: 'Sisa_Pembayaran' },
      { header: 'Tanggal Ekspor', key: 'Tanggal_Ekspor' }
    ];
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for better readability
    ws['!cols'] = columns.map(() => ({ wch: 20 }));
    
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Kunjungan');
    
    // Generate Excel file with current date in filename
    const currentDate = format(new Date(), 'yyyyMMdd');
    XLSX.writeFile(wb, `daftar-kunjungan-${currentDate}.xlsx`);
    
    toast('Data kunjungan berhasil diunduh sebagai file Excel');
  } catch (error) {
    console.error('Error exporting visits:', error);
    toast('Gagal mengekspor data');
  }
};
