import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { getActivityLabel } from '@/utils/visitHelpers';
import { toast } from 'sonner';
import { formatCurrency, formatInvoiceNumber, formatShortDate } from './formatters';
import { getProductPrices } from './export/invoiceUtils';

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

// Generate header style for invoice
const headerStyle = {
  font: { bold: true, size: 14 },
  alignment: { horizontal: 'center', vertical: 'center' }
};

// Generate subheader style for invoice
const subheaderStyle = {
  font: { bold: true, size: 12 },
  alignment: { horizontal: 'center', vertical: 'center' }
};

// Generate table header style
const tableHeaderStyle = {
  font: { bold: true },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: borderStyle,
  fill: { fgColor: { rgb: "E5E5E5" } }
};

// Add professional invoice header
const addProfessionalHeader = (ws: XLSX.WorkSheet) => {
  // Set column widths for A4 size approximation
  const colWidths = [8, 12, 25, 10, 15, 15];
  ws['!cols'] = colWidths.map(wch => ({ wch }));
  
  // Set row heights for header section
  ws['!rows'] = [
    { hpt: 30 }, // Title row
    { hpt: 25 }, // Subtitle row
    { hpt: 20 }, // Address row
    { hpt: 20 }, // Phone row
    { hpt: 20 }, // Email row
    { hpt: 20 }, // Blank row
  ];
  
  // Main title
  ws['B1'] = { v: 'INVOICE', t: 's', s: headerStyle };
  ws['C1'] = { v: '', t: 's', s: headerStyle };
  ws['D1'] = { v: '', t: 's', s: headerStyle };
  ws['E1'] = { v: '', t: 's', s: headerStyle };
  
  // Subtitle
  ws['B2'] = { v: 'KEBUN WISATA PASIRMUKTI', t: 's', s: subheaderStyle };
  ws['C2'] = { v: '', t: 's', s: subheaderStyle };
  ws['D2'] = { v: '', t: 's', s: subheaderStyle };
  ws['E2'] = { v: '', t: 's', s: subheaderStyle };
  
  // Company details
  ws['B3'] = { v: 'Jl. Raya Tajur – Pasirmukti KM. 4 Citeureup – Bogor 16810', t: 's', 
    s: { alignment: { horizontal: 'center' }} };
  ws['C3'] = { v: '', t: 's' };
  ws['D3'] = { v: '', t: 's' };
  ws['E3'] = { v: '', t: 's' };
  
  // Phone and fax
  ws['B4'] = { v: 'Phone: (021) 8794 7002    Fax: (021) 8794 7003', t: 's', 
    s: { alignment: { horizontal: 'center' }} };
  ws['C4'] = { v: '', t: 's' };
  ws['D4'] = { v: '', t: 's' };
  ws['E4'] = { v: '', t: 's' };
  
  // Email
  ws['B5'] = { v: 'Email: info@pasirmukti.co.id', t: 's', 
    s: { alignment: { horizontal: 'center' }} };
  ws['C5'] = { v: '', t: 's' };
  ws['D5'] = { v: '', t: 's' };
  ws['E5'] = { v: '', t: 's' };

  // Merge cells for titles
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push(
    { s: { r: 0, c: 1 }, e: { r: 0, c: 5 } }, // Main title
    { s: { r: 1, c: 1 }, e: { r: 1, c: 5 } }, // Subtitle
    { s: { r: 2, c: 1 }, e: { r: 2, c: 5 } }, // Address
    { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } }, // Phone
    { s: { r: 4, c: 1 }, e: { r: 4, c: 5 } }  // Email
  );
  
  return 7; // Return next row index
};

// Add invoice info and customer details
const addInvoiceInfo = (ws: XLSX.WorkSheet, visit: Visit, startRow: number) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const invoiceNumber = formatInvoiceNumber(visit.order_id);
  
  // Invoice info box (right)
  ws[`D${startRow}`] = { v: 'No. Invoice', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`E${startRow}`] = { v: invoiceNumber, t: 's', s: { border: borderStyle } };
  
  ws[`D${startRow+1}`] = { v: 'Tanggal Invoice', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`E${startRow+1}`] = { v: formatShortDate(currentDate), t: 's', s: { border: borderStyle } };
  
  ws[`D${startRow+2}`] = { v: 'No. Order', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`E${startRow+2}`] = { v: visit.order_id || '-', t: 's', s: { border: borderStyle } };
  
  ws[`D${startRow+3}`] = { v: 'Tanggal Order', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`E${startRow+3}`] = { v: formatShortDate(visit.visit_date), t: 's', s: { border: borderStyle } };

  // Customer info box (left)
  ws[`A${startRow}`] = { v: 'Nama Pemesan', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`B${startRow}`] = { v: visit.responsible_person, t: 's', s: { border: borderStyle } };
  ws[`C${startRow}`] = { v: '', t: 's', s: { border: borderStyle } };
  
  ws[`A${startRow+1}`] = { v: 'Instansi/Perusahaan', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`B${startRow+1}`] = { v: visit.institution_name, t: 's', s: { border: borderStyle } };
  ws[`C${startRow+1}`] = { v: '', t: 's', s: { border: borderStyle } };
  
  ws[`A${startRow+2}`] = { v: 'Alamat', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`B${startRow+2}`] = { v: '-', t: 's', s: { border: borderStyle } };
  ws[`C${startRow+2}`] = { v: '', t: 's', s: { border: borderStyle } };
  
  ws[`A${startRow+3}`] = { v: 'No. HP', t: 's', s: { font: { bold: true }, border: borderStyle } };
  ws[`B${startRow+3}`] = { v: '-', t: 's', s: { border: borderStyle } };
  ws[`C${startRow+3}`] = { v: '', t: 's', s: { border: borderStyle } };

  // Merge customer info cells
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push(
    { s: { r: startRow-1, c: 1 }, e: { r: startRow-1, c: 2 } },
    { s: { r: startRow, c: 1 }, e: { r: startRow, c: 2 } },
    { s: { r: startRow+1, c: 1 }, e: { r: startRow+1, c: 2 } },
    { s: { r: startRow+2, c: 1 }, e: { r: startRow+2, c: 2 } }
  );

  return startRow + 5; // Return next row index
};

// Add table of services
const addServicesTable = (ws: XLSX.WorkSheet, visit: Visit, startRow: number) => {
  // Table headers
  ws[`A${startRow}`] = { v: 'No', t: 's', s: tableHeaderStyle };
  ws[`B${startRow}`] = { v: 'Nama Produk', t: 's', s: tableHeaderStyle };
  ws[`C${startRow}`] = { v: 'Deskripsi', t: 's', s: tableHeaderStyle };
  ws[`D${startRow}`] = { v: 'Jumlah', t: 's', s: tableHeaderStyle };
  ws[`E${startRow}`] = { v: 'Harga Satuan', t: 's', s: tableHeaderStyle };
  ws[`F${startRow}`] = { v: 'Subtotal', t: 's', s: tableHeaderStyle };
  
  let currentRow = startRow + 1;
  let itemNumber = 1;

  // Package name and description
  const packageName = getPackageLabel(visit.visit_type || '');
  const packageType = getActivityLabel(visit.visit_type || '');
  
  // Adult visitors
  if (visit.adult_count && visit.adult_count > 0) {
    const prices = getProductPrices();
    const adultPrice = prices.adultPrice; // Base price per adult
    const adultSubtotal = adultPrice * visit.adult_count;
    
    ws[`A${currentRow}`] = { v: itemNumber++, t: 'n', s: { border: borderStyle } };
    ws[`B${currentRow}`] = { v: packageName, t: 's', s: { border: borderStyle } };
    ws[`C${currentRow}`] = { v: 'Tiket Masuk Dewasa', t: 's', s: { border: borderStyle } };
    ws[`D${currentRow}`] = { v: visit.adult_count, t: 'n', s: { border: borderStyle, alignment: { horizontal: 'center' } } };
    ws[`E${currentRow}`] = { v: formatCurrency(adultPrice).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    ws[`F${currentRow}`] = { v: formatCurrency(adultSubtotal).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    
    currentRow++;
  }
  
  // Children visitors
  if (visit.children_count && visit.children_count > 0) {
    const prices = getProductPrices();
    const childPrice = prices.childPrice; // Base price per child
    const childSubtotal = childPrice * visit.children_count;
    
    ws[`A${currentRow}`] = { v: itemNumber++, t: 'n', s: { border: borderStyle } };
    ws[`B${currentRow}`] = { v: packageName, t: 's', s: { border: borderStyle } };
    ws[`C${currentRow}`] = { v: 'Tiket Masuk Anak', t: 's', s: { border: borderStyle } };
    ws[`D${currentRow}`] = { v: visit.children_count, t: 'n', s: { border: borderStyle, alignment: { horizontal: 'center' } } };
    ws[`E${currentRow}`] = { v: formatCurrency(childPrice).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    ws[`F${currentRow}`] = { v: formatCurrency(childSubtotal).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    
    currentRow++;
  }
  
  // Teacher visitors
  if (visit.teacher_count && visit.teacher_count > 0) {
    const prices = getProductPrices();
    const teacherPrice = prices.teacherPrice; // Base price per teacher
    const teacherSubtotal = teacherPrice * visit.teacher_count;
    
    ws[`A${currentRow}`] = { v: itemNumber++, t: 'n', s: { border: borderStyle } };
    ws[`B${currentRow}`] = { v: packageName, t: 's', s: { border: borderStyle } };
    ws[`C${currentRow}`] = { v: 'Tiket Masuk Guru', t: 's', s: { border: borderStyle } };
    ws[`D${currentRow}`] = { v: visit.teacher_count, t: 'n', s: { border: borderStyle, alignment: { horizontal: 'center' } } };
    ws[`E${currentRow}`] = { v: formatCurrency(teacherPrice).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    ws[`F${currentRow}`] = { v: formatCurrency(teacherSubtotal).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    
    currentRow++;
  }
  
  // Add accommodation if applicable
  if (visit.rooms_json && visit.nights_count && visit.nights_count > 0) {
    const roomData = visit.rooms_json;
    const rooms = Object.entries(roomData.accommodation_counts || {});
    
    // Add each room type
    rooms.forEach(([roomType, count]) => {
      if (count > 0) {
        const roomPrice = 1250000; // Base price per room
        const roomSubtotal = roomPrice * Number(count) * visit.nights_count!;
        
        ws[`A${currentRow}`] = { v: itemNumber++, t: 'n', s: { border: borderStyle } };
        ws[`B${currentRow}`] = { v: 'Akomodasi', t: 's', s: { border: borderStyle } };
        ws[`C${currentRow}`] = { v: `${roomType} (${visit.nights_count} malam)`, t: 's', s: { border: borderStyle } };
        ws[`D${currentRow}`] = { v: count, t: 'n', s: { border: borderStyle, alignment: { horizontal: 'center' } } };
        ws[`E${currentRow}`] = { v: formatCurrency(roomPrice).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
        ws[`F${currentRow}`] = { v: formatCurrency(roomSubtotal).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
        
        currentRow++;
      }
    });
    
    // Add extra beds if any
    const extraBeds = Object.values(roomData.extra_bed_counts || {}).reduce((sum, count) => sum + Number(count), 0);
    if (extraBeds > 0) {
      const extraBedPrice = 160000; // Base price per extra bed
      const extraBedSubtotal = extraBedPrice * extraBeds * visit.nights_count!;
      
      ws[`A${currentRow}`] = { v: itemNumber++, t: 'n', s: { border: borderStyle } };
      ws[`B${currentRow}`] = { v: 'Akomodasi', t: 's', s: { border: borderStyle } };
      ws[`C${currentRow}`] = { v: `Extra Bed (${visit.nights_count} malam)`, t: 's', s: { border: borderStyle } };
      ws[`D${currentRow}`] = { v: extraBeds, t: 'n', s: { border: borderStyle, alignment: { horizontal: 'center' } } };
      ws[`E${currentRow}`] = { v: formatCurrency(extraBedPrice).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
      ws[`F${currentRow}`] = { v: formatCurrency(extraBedSubtotal).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
      
      currentRow++;
    }
  }
  
  // Add venues if applicable
  if (visit.venues_json && visit.venues_json.selected_venues && visit.venues_json.selected_venues.length > 0) {
    const venues = visit.venues_json.selected_venues;
    
    venues.forEach(venue => {
      const venuePrice = 500000; // Base price per venue
      
      ws[`A${currentRow}`] = { v: itemNumber++, t: 'n', s: { border: borderStyle } };
      ws[`B${currentRow}`] = { v: 'Venue', t: 's', s: { border: borderStyle } };
      ws[`C${currentRow}`] = { v: venue, t: 's', s: { border: borderStyle } };
      ws[`D${currentRow}`] = { v: 1, t: 'n', s: { border: borderStyle, alignment: { horizontal: 'center' } } };
      ws[`E${currentRow}`] = { v: formatCurrency(venuePrice).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
      ws[`F${currentRow}`] = { v: formatCurrency(venuePrice).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
      
      currentRow++;
    });
  }

  return currentRow;
};

// Add payment summary
const addPaymentSummary = (ws: XLSX.WorkSheet, visit: Visit, startRow: number) => {
  const summaryStyle = { 
    font: { bold: true }, 
    border: borderStyle,
    alignment: { horizontal: 'right' }
  };
  
  const valueStyle = {
    border: borderStyle,
    alignment: { horizontal: 'right' }
  };
  
  // Calculate base total
  const baseTotal = visit.total_cost || 0;
  
  // Subtotal row
  ws[`E${startRow}`] = { v: 'Subtotal', t: 's', s: summaryStyle };
  ws[`F${startRow}`] = { v: formatCurrency(baseTotal).replace('Rp', '').trim(), t: 's', s: valueStyle };
  
  let currentRow = startRow + 1;
  
  // Discount row if applicable
  if (visit.discount_percentage && visit.discount_percentage > 0) {
    const discountAmount = baseTotal * (visit.discount_percentage / 100);
    
    ws[`E${currentRow}`] = { v: `Diskon (${visit.discount_percentage}%)`, t: 's', s: summaryStyle };
    ws[`F${currentRow}`] = { v: `- ${formatCurrency(discountAmount).replace('Rp', '').trim()}`, t: 's', s: valueStyle };
    
    currentRow++;
  }
  
  // Total after discount
  const finalTotal = visit.discounted_cost || baseTotal;
  
  ws[`E${currentRow}`] = { v: 'Total', t: 's', s: summaryStyle };
  ws[`F${currentRow}`] = { v: formatCurrency(finalTotal).replace('Rp', '').trim(), t: 's', s: valueStyle };
  
  currentRow += 2;
  
  // Down payment if applicable
  if (visit.down_payment && visit.down_payment > 0) {
    ws[`E${currentRow}`] = { v: 'DP (Transfer)', t: 's', s: summaryStyle };
    ws[`F${currentRow}`] = { v: formatCurrency(visit.down_payment).replace('Rp', '').trim(), t: 's', s: valueStyle };
    
    currentRow++;
    
    // Remaining amount
    const remainingAmount = finalTotal - visit.down_payment;
    
    ws[`E${currentRow}`] = { v: 'Sisa Pembayaran', t: 's', s: summaryStyle };
    ws[`F${currentRow}`] = { v: formatCurrency(remainingAmount).replace('Rp', '').trim(), t: 's', s: valueStyle };
    
    currentRow++;
  }
  
  return currentRow + 2; // Return next row index with some spacing
};

// Add footer section
const addFooter = (ws: XLSX.WorkSheet, startRow: number) => {
  // Thank you note
  ws[`B${startRow}`] = { v: 'Terima kasih atas kunjungan Anda.', t: 's', 
    s: { alignment: { horizontal: 'center' }, font: { italic: true } } };
  ws[`C${startRow}`] = { v: '', t: 's' };
  ws[`D${startRow}`] = { v: '', t: 's' };
  
  // Merge thank you cells
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push(
    { s: { r: startRow - 1, c: 1 }, e: { r: startRow - 1, c: 4 } }
  );
  
  // Signature section
  ws[`E${startRow+2}`] = { v: 'Hormat kami,', t: 's', 
    s: { alignment: { horizontal: 'center' } } };
  
  ws[`E${startRow+6}`] = { v: 'Kebun Wisata Pasirmukti', t: 's', 
    s: { alignment: { horizontal: 'center' }, font: { bold: true } } };
  
  // Merge signature cells
  ws['!merges'].push(
    { s: { r: startRow + 1, c: 4 }, e: { r: startRow + 1, c: 5 } },
    { s: { r: startRow + 5, c: 4 }, e: { r: startRow + 5, c: 5 } }
  );
};

// Export visit data to Excel with professional invoice format
export const exportVisitToExcel = (visit: Visit) => {
  try {
    // Create new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[]]);
    
    // Add professional header
    const headerEndRow = addProfessionalHeader(ws);
    
    // Add invoice info and customer details
    const infoEndRow = addInvoiceInfo(ws, visit, headerEndRow);
    
    // Add services table
    const tableEndRow = addServicesTable(ws, visit, infoEndRow);
    
    // Add payment summary
    const summaryEndRow = addPaymentSummary(ws, visit, tableEndRow);
    
    // Add footer with signature
    addFooter(ws, summaryEndRow);
    
    // Set print area and page setup for A4
    ws['!print'] = { 
      area: "A1:F50",
      orientation: 'portrait',
      fitToPage: true
    };
    
    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
    
    // Generate Excel file with order ID in filename
    const currentDate = format(new Date(), 'yyyyMMdd');
    const invoiceNumber = formatInvoiceNumber(visit.order_id);
    XLSX.writeFile(wb, `INVOICE-${invoiceNumber.replace(/\//g, '-')}-${currentDate}.xlsx`);
    
    toast('Invoice berhasil diunduh sebagai file Excel');
  } catch (error) {
    console.error('Error exporting invoice:', error);
    toast('Gagal mengekspor invoice');
  }
};

// Export all visits data to Excel - keep existing functionality
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
