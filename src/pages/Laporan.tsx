
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReportData } from '@/hooks/useReportData';
import { formatCurrency, formatDate, getPaymentStatusLabel } from '@/utils/formatters';
import { exportAllVisitsToExcel } from '@/utils/export/exportHelpers';

const Laporan: React.FC = () => {
  const navigate = useNavigate();
  const { visits, isLoading, summary, filters, updateFilter, applyFilters } = useReportData();

  const handleExportExcel = () => {
    exportAllVisitsToExcel(visits);
  };

  return (
    <div className="p-6 space-y-8">
      {/* 1. Filters/Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
          <Input 
            type="date" 
            value={filters.startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
          <Input 
            type="date" 
            value={filters.endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Paket</label>
          <Select
            value={filters.packageType || ''}
            onValueChange={(value) => updateFilter('packageType', value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="wisata_edukasi">Wisata Edukasi</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
                <SelectItem value="camping">Camping</SelectItem>
                <SelectItem value="field_trip">Field Trip</SelectItem>
                <SelectItem value="penelitian">Penelitian</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Institusi</label>
          <Input 
            type="text" 
            placeholder="Cari institusi..." 
            value={filters.institution || ''}
            onChange={(e) => updateFilter('institution', e.target.value || null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status Pembayaran</label>
          <Select
            value={filters.paymentStatus || ''}
            onValueChange={(value) => updateFilter('paymentStatus', value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="default" onClick={applyFilters}>Terapkan</Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Total Kunjungan</div>
          <div className="text-2xl font-bold">{summary.totalVisits}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Total Pendapatan</div>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Total Peserta</div>
          <div className="text-2xl font-bold">{summary.totalParticipants}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Paket Terpopuler</div>
          <div className="text-2xl font-bold">{summary.topPackage}</div>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded shadow p-4">
        {isLoading ? (
          <div className="text-center p-4">Memuat data...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal Kunjungan</TableHead>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Institusi</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead className="text-center">Dewasa</TableHead>
                <TableHead className="text-center">Anak</TableHead>
                <TableHead className="text-center">Guru</TableHead>
                <TableHead className="text-right">Total Biaya</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center p-4">
                    Tidak ada data untuk ditampilkan
                  </TableCell>
                </TableRow>
              ) : (
                visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>{formatDate(visit.visit_date)}</TableCell>
                    <TableCell>{visit.order_id || '-'}</TableCell>
                    <TableCell>{visit.institution_name}</TableCell>
                    <TableCell>{(visit as any).package_type || visit.visit_type || '-'}</TableCell>
                    <TableCell className="text-center">{visit.adult_count || 0}</TableCell>
                    <TableCell className="text-center">{visit.children_count || 0}</TableCell>
                    <TableCell className="text-center">{visit.teacher_count || 0}</TableCell>
                    <TableCell className="text-right">{formatCurrency(visit.discounted_cost)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={visit.payment_status === 'lunas' ? 'default' : 'outline'}>
                        {getPaymentStatusLabel(visit.payment_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/guest-registration/view/${visit.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Laporan;
