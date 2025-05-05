import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Visit } from '@/types/visit';
import { toast } from 'sonner';
import { formatCurrency, formatInvoiceNumber, formatShortDate } from '../formatters';
import { getActivityLabel } from '@/utils/visitHelpers';

// --- Styles ---
const borderStyle = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
const headerStyle = { font: { bold: true, sz: 18 }, alignment: { horizontal: 'center' } };
const subheaderStyle = { font: { bold: true, sz: 14 }, alignment: { horizontal: 'center' } };
const tableHeaderStyle = { font: { bold: true }, alignment: { horizontal: 'center' }, border: borderStyle };

// --- Main Export Function ---
export const exportVisitInvoice = async (visit: Visit) => {
  try {
    // Fetch all packages from Supabase for mapping
    const { data: allPackages, error } = await (await import('@/integrations/supabase/client')).supabase
      .from('packages')
      .select('id, name, price_per_adult, price_per_child, price_per_teacher');
    const packageMap = (allPackages || []).reduce((acc, pkg) => {
      acc[pkg.id] = pkg;
      return acc;
    }, {});

    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = {};
    ws['!cols'] = [ { wch: 8 }, { wch: 28 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 } ];
    let row = 1;
    ws[`B${row}`] = { v: 'INVOICE', t: 's', s: headerStyle };
    ws['!merges'] = [ { s: { r: row-1, c: 1 }, e: { r: row-1, c: 6 } } ];
    row++;
    ws[`B${row}`] = { v: 'KEBUN WISATA PASIRMUKTI', t: 's', s: subheaderStyle };
    ws['!merges'].push({ s: { r: row-1, c: 1 }, e: { r: row-1, c: 6 } });
    row++;
    ws[`B${row}`] = { v: 'Jl. Raya Tajur – Pasirmukti KM. 4 Citeureup – Bogor 16810', t: 's', s: { alignment: { horizontal: 'center' } } };
    ws['!merges'].push({ s: { r: row-1, c: 1 }, e: { r: row-1, c: 6 } });
    row++;
    ws[`B${row}`] = { v: 'Phone: (021) 8794 7002    Fax: (021) 8794 7003', t: 's', s: { alignment: { horizontal: 'center' } } };
    ws['!merges'].push({ s: { r: row-1, c: 1 }, e: { r: row-1, c: 6 } });
    row++;
    ws[`B${row}`] = { v: 'Email: info@pasirmukti.co.id', t: 's', s: { alignment: { horizontal: 'center' } } };
    ws['!merges'].push({ s: { r: row-1, c: 1 }, e: { r: row-1, c: 6 } });
    row += 2;
    ws[`D${row}`] = { v: 'No. Invoice', t: 's', s: { font: { bold: true }, border: borderStyle } };
    ws[`E${row}`] = { v: formatInvoiceNumber(visit.order_id), t: 's', s: { border: borderStyle } };
    ws[`A${row}`] = { v: 'Nama Pemesan', t: 's', s: { font: { bold: true }, border: borderStyle } };
    ws[`B${row}`] = { v: visit.responsible_person, t: 's', s: { border: borderStyle } };
    row++;
    ws[`D${row}`] = { v: 'Tanggal Invoice', t: 's', s: { font: { bold: true }, border: borderStyle } };
    ws[`E${row}`] = { v: formatShortDate(format(new Date(), 'yyyy-MM-dd')), t: 's', s: { border: borderStyle } };
    ws[`A${row}`] = { v: 'Instansi/Perusahaan', t: 's', s: { font: { bold: true }, border: borderStyle } };
    ws[`B${row}`] = { v: visit.institution_name, t: 's', s: { border: borderStyle } };
    row++;
    ws[`D${row}`] = { v: 'No. Order', t: 's', s: { font: { bold: true }, border: borderStyle } };
    ws[`E${row}`] = { v: visit.order_id || '-', t: 's', s: { border: borderStyle } };
    row++;
    ws[`D${row}`] = { v: 'Tanggal Order', t: 's', s: { font: { bold: true }, border: borderStyle } };
    ws[`E${row}`] = { v: formatShortDate(visit.visit_date), t: 's', s: { border: borderStyle } };
    row += 2;
    // --- Package Breakdown Table ---
    ws[`A${row}`] = { v: 'Nama Paket', t: 's', s: tableHeaderStyle };
    ws[`B${row}`] = { v: 'Dewasa', t: 's', s: tableHeaderStyle };
    ws[`C${row}`] = { v: 'Anak', t: 's', s: tableHeaderStyle };
    ws[`D${row}`] = { v: 'Guru', t: 's', s: tableHeaderStyle };
    ws[`E${row}`] = { v: 'Guru (Free)', t: 's', s: tableHeaderStyle };
    ws[`F${row}`] = { v: 'Jumlah', t: 's', s: tableHeaderStyle };
    row++;
    // Parse packages_json
    let packagesData = { selected_packages: [], package_participants: {} };
    try {
      const rawPackagesJson = (visit as any).packages_json;
      if (rawPackagesJson) {
        if (typeof rawPackagesJson === 'string') {
          packagesData = JSON.parse(rawPackagesJson);
        } else if (typeof rawPackagesJson === 'object') {
          packagesData = rawPackagesJson;
        }
      }
    } catch (err) {}
    // For each selected package, show breakdown
    for (const packageId of packagesData.selected_packages || []) {
      const pkg = packageMap[packageId] || { name: packageId };
      const participants = packagesData.package_participants?.[packageId] || {};
      const adults = participants.adults || 0;
      const children = participants.children || 0;
      const teachers = participants.teachers || 0;
      const free_teachers = participants.free_teachers || 0;
      const priceAdult = pkg.price_per_adult || 0;
      const priceChild = pkg.price_per_child || 0;
      const priceTeacher = pkg.price_per_teacher || 0;
      const total = (adults * priceAdult) + (children * priceChild) + (teachers * priceTeacher);
      ws[`A${row}`] = { v: pkg.name, t: 's', s: { border: borderStyle } };
      ws[`B${row}`] = { v: adults > 0 ? `${adults} (Rp ${formatCurrency(adults * priceAdult)})` : '-', t: 's', s: { border: borderStyle } };
      ws[`C${row}`] = { v: children > 0 ? `${children} (Rp ${formatCurrency(children * priceChild)})` : '-', t: 's', s: { border: borderStyle } };
      ws[`D${row}`] = { v: teachers > 0 ? `${teachers} (Rp ${formatCurrency(teachers * priceTeacher)})` : '-', t: 's', s: { border: borderStyle } };
      ws[`E${row}`] = { v: free_teachers > 0 ? `${free_teachers} (Rp 0)` : '-', t: 's', s: { border: borderStyle } };
      ws[`F${row}`] = { v: `Rp ${formatCurrency(total)}`, t: 's', s: { border: borderStyle } };
      row++;
    }
    row++;
    // --- Payment Summary ---
    ws[`E${row}`] = { v: 'Subtotal', t: 's', s: { font: { bold: true }, border: borderStyle, alignment: { horizontal: 'right' } } };
    ws[`F${row}`] = { v: formatCurrency(visit.total_cost).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    row++;
    if (visit.discount_percentage && visit.discount_percentage > 0) {
      ws[`E${row}`] = { v: `Diskon (${visit.discount_percentage}%)`, t: 's', s: { font: { bold: true }, border: borderStyle, alignment: { horizontal: 'right' } } };
      ws[`F${row}`] = { v: `- ${formatCurrency((visit.total_cost || 0) * (visit.discount_percentage / 100)).replace('Rp', '').trim()}`, t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
      row++;
    }
    ws[`E${row}`] = { v: 'Total', t: 's', s: { font: { bold: true }, border: borderStyle, alignment: { horizontal: 'right' } } };
    ws[`F${row}`] = { v: formatCurrency(visit.discounted_cost || visit.total_cost).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
    row++;
    if (visit.down_payment && visit.down_payment > 0) {
      ws[`E${row}`] = { v: 'DP (Transfer)', t: 's', s: { font: { bold: true }, border: borderStyle, alignment: { horizontal: 'right' } } };
      ws[`F${row}`] = { v: formatCurrency(visit.down_payment).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
      row++;
      ws[`E${row}`] = { v: 'Sisa Pembayaran', t: 's', s: { font: { bold: true }, border: borderStyle, alignment: { horizontal: 'right' } } };
      ws[`F${row}`] = { v: formatCurrency((visit.discounted_cost || visit.total_cost) - visit.down_payment).replace('Rp', '').trim(), t: 's', s: { border: borderStyle, alignment: { horizontal: 'right' } } };
      row++;
    }
    row++;
    ws[`B${row}`] = { v: 'Terima kasih atas kunjungan Anda.', t: 's', s: { alignment: { horizontal: 'center' }, font: { italic: true } } };
    ws['!merges'].push({ s: { r: row-1, c: 1 }, e: { r: row-1, c: 4 } });
    row += 2;
    ws[`E${row}`] = { v: 'Hormat kami,', t: 's', s: { alignment: { horizontal: 'center' } } };
    row += 4;
    ws[`E${row}`] = { v: 'Kebun Wisata Pasirmukti', t: 's', s: { alignment: { horizontal: 'center' }, font: { bold: true } } };
    const range = XLSX.utils.decode_range(`A1:F${row}`);
    ws['!ref'] = XLSX.utils.encode_range(range);
    ws['!print'] = { area: `A1:F${row}`, orientation: 'portrait', fitToPage: true };
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
    const currentDate = format(new Date(), 'yyyyMMdd');
    const invoiceNumber = formatInvoiceNumber(visit.order_id);
    const filename = `INVOICE-${invoiceNumber.replace(/\//g, '-')}-${currentDate}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast('Invoice berhasil diunduh sebagai file Excel');
  } catch (error) {
    console.error('Error exporting invoice:', error);
    toast('Gagal mengekspor invoice');
  }
};
