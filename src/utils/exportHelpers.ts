
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

// Create a worksheet style with custom headers
const createStyledWorksheet = (data: any[], columns: { header: string; key: string }[]): XLSX.WorkSheet => {
  // Create a worksheet with the data
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Set column widths and styles for better readability
  const colWidths = columns.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;
  
  return ws;
};

// Export visit data to Excel
export const exportVisitToExcel = (visit: Visit) => {
  try {
    // Prepare data with more details
    const data = [{
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
    }];
    
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
    const ws = createStyledWorksheet(data, columns);
    
    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detail Kunjungan');
    
    // Generate Excel file with current date in filename
    const currentDate = format(new Date(), 'yyyyMMdd');
    XLSX.writeFile(wb, `kunjungan-${visit.order_id || visit.id}-${currentDate}.xlsx`);
    
    toast('Data kunjungan berhasil diunduh sebagai file Excel');
  } catch (error) {
    console.error('Error exporting visit:', error);
    toast('Gagal mengekspor data');
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
      Sisa_Pembayaran: visit => formatCurrency((visit.discounted_cost || 0) - (visit.down_payment || 0))
    }));
    
    // Column definitions
    const columns = [
      { header: 'ID Pesanan', key: 'ID_Pesanan' },
      { header: 'Institusi', key: 'Institusi' },
      { header: 'Penanggung Jawab', key: 'Penanggung_Jawab' },
      { header: 'Tanggal Kunjungan', key: 'Tanggal_Kunjungan' },
      { header: 'Jenis Kegiatan', key: 'Jenis_Kegiatan' },
      { header: 'Jumlah Pengunjung', key: 'Jumlah_Pengunjung' },
      { header: 'Status Pembayaran', key: 'Status_Pembayaran' },
      { header: 'Total Biaya', key: 'Total_Biaya' },
      { header: 'Diskon', key: 'Diskon' },
      { header: 'Biaya Setelah Diskon', key: 'Biaya_Setelah_Diskon' },
      { header: 'Uang Muka', key: 'Uang_Muka' },
      { header: 'Sisa Pembayaran', key: 'Sisa_Pembayaran' }
    ];
    
    // Create worksheet
    const ws = createStyledWorksheet(data, columns);
    
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
