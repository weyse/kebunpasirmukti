import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { toast } from 'sonner';
import { formatCurrency, formatInvoiceNumber, formatShortDate } from '../formatters';
import { getActivityLabel } from '@/utils/visitHelpers';
import { 
  borderStyle, 
  headerStyle, 
  subheaderStyle, 
  tableHeaderStyle, 
  getPackageLabel, 
  getProductPrices 
} from './invoiceUtils';

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
  const prices = getProductPrices();
  
  // Adult visitors
  if (visit.adult_count && visit.adult_count > 0) {
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
        const roomPrice = prices.roomPrice; // Base price per room
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
    const extraBeds = Object.values(roomData.extra_bed_counts || {}).reduce((sum, c) => Number(sum) + Number(c), 0);
    if (Number(extraBeds) > 0) {
      const extraBedPrice = prices.extraBedPrice; // Base price per extra bed
      const extraBedSubtotal = extraBedPrice * Number(extraBeds) * visit.nights_count!;
      
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
      const venuePrice = prices.venuePrice; // Base price per venue
      
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
export const exportVisitInvoice = (visit) => {
  const formatRupiah = (num) => typeof num === 'number' ? 'Rp ' + num.toLocaleString('id-ID') : num;
  const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';

  const data = [
    ['INVOICE'],
    ['Kebun Wisata Pasirmukti'],
    ['Jl. Raya Tajur – Pasirmukti KM. 4 Citeureup – Bogor 16810'],
    ['Phone: (021) 8794 7002    Fax: (021) 8794 7003'],
    ['Email: info@pasirmukti.co.id'],
    [],
    ['Order Information'],
    ['Order ID', visit.order_id || ''],
    ['Customer', visit.responsible_person || ''],
    ['Institution', visit.institution_name || ''],
    ['Phone', visit.phone_number || ''],
    ['Visit Date', formatDate(visit.visit_date)],
    ['Type', visit.visit_type || ''],
    ['Notes', visit.notes || ''],
    ['Payment Status', visit.payment_status || ''],
    [],
    ['Details'],
    ['Item', 'Qty', 'Unit Price', 'Subtotal'],
  ];

  // Add items
  if (visit.items && Array.isArray(visit.items) && visit.items.length > 0) {
    visit.items.forEach((item) => {
      data.push([
        item.description || '',
        item.qty || '',
        formatRupiah(Number(item.unit_price) || 0),
        formatRupiah(Number(item.subtotal) || 0),
      ]);
    });
  } else {
    data.push(['-', '-', '-', '-']);
  }

  data.push([]);
  data.push(['Payment Summary']);
  data.push(['Subtotal', '', '', formatRupiah(Number(visit.total_cost) || 0)]);
  if (Number(visit.discount_percentage) > 0) {
    data.push(['Discount', `${visit.discount_percentage}%`, '', '-' + formatRupiah(((Number(visit.total_cost) || 0) * (Number(visit.discount_percentage) / 100)))]);
  }
  data.push(['Total', '', '', formatRupiah(Number(visit.discounted_cost) || Number(visit.total_cost) || 0)]);
  if (Number(visit.down_payment) > 0) {
    data.push(['Down Payment', '', '', formatRupiah(Number(visit.down_payment))]);
    data.push(['Remaining', '', '', formatRupiah((Number(visit.discounted_cost) || Number(visit.total_cost) || 0) - (Number(visit.down_payment) || 0))]);
  }

  data.push([]);
  data.push(['Thank you for your visit!']);
  data.push(['Kebun Wisata Pasirmukti']);

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
  XLSX.writeFile(wb, `invoice-${visit.order_id || 'unknown'}.xlsx`);
};
