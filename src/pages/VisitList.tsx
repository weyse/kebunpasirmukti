
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, ArrowUpDown, Download, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Define visit data types
type Visit = {
  id: string;
  institutionName: string;
  responsiblePerson: string;
  totalVisitors: number;
  activityType: string;
  visitDate: Date;
  status: 'completed' | 'cancelled' | 'no_show';
};

// Mock data for past visits
const mockVisits: Visit[] = [
  {
    id: 'PSD-AB1CD2',
    institutionName: 'SD Negeri 5 Jakarta',
    responsiblePerson: 'Bambang Sutrisno',
    totalVisitors: 95,
    activityType: 'wisata_edukasi',
    visitDate: new Date('2025-04-15'),
    status: 'completed',
  },
  {
    id: 'PSD-EF3GH4',
    institutionName: 'SMA Negeri 2 Bogor',
    responsiblePerson: 'Dewi Lestari',
    totalVisitors: 78,
    activityType: 'penelitian',
    visitDate: new Date('2025-04-12'),
    status: 'completed',
  },
  {
    id: 'PSD-IJ5KL6',
    institutionName: 'Komunitas Lingkungan Hijau',
    responsiblePerson: 'Eko Prabowo',
    totalVisitors: 20,
    activityType: 'camping',
    visitDate: new Date('2025-04-10'),
    status: 'completed',
  },
  {
    id: 'PSD-MN7OP8',
    institutionName: 'TK Bunga Bangsa',
    responsiblePerson: 'Fitri Handayani',
    totalVisitors: 35,
    activityType: 'field_trip',
    visitDate: new Date('2025-04-08'),
    status: 'no_show',
  },
  {
    id: 'PSD-QR9ST0',
    institutionName: 'PT Maju Bersama',
    responsiblePerson: 'Gunawan Wibisono',
    totalVisitors: 42,
    activityType: 'outbound',
    visitDate: new Date('2025-04-05'),
    status: 'cancelled',
  },
  {
    id: 'PSD-UV1WX2',
    institutionName: 'Keluarga Arjuna',
    responsiblePerson: 'Hari Setiawan',
    totalVisitors: 5,
    activityType: 'wisata_edukasi',
    visitDate: new Date('2025-04-03'),
    status: 'completed',
  },
  {
    id: 'PSD-YZ3AB4',
    institutionName: 'SMP Negeri 3 Bandung',
    responsiblePerson: 'Indra Gunawan',
    totalVisitors: 66,
    activityType: 'field_trip',
    visitDate: new Date('2025-04-01'),
    status: 'completed',
  },
];

// Helper function for activity type labels
const getActivityLabel = (type: string): string => {
  const labels: Record<string, string> = {
    wisata_edukasi: 'Wisata Edukasi',
    outbound: 'Outbound',
    camping: 'Camping',
    field_trip: 'Field Trip',
    penelitian: 'Penelitian',
    lainnya: 'Lainnya',
  };
  return labels[type] || type;
};

// Helper function for status labels and colors
const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    completed: {
      label: 'Selesai',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    cancelled: {
      label: 'Dibatalkan',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    no_show: {
      label: 'Tidak Hadir',
      className: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  };
  return statusMap[status] || { label: status, className: '' };
};

// Main component
const VisitList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);
  
  // Filter visits based on search and filters
  const filteredVisits = mockVisits.filter((visit) => {
    const matchesSearch =
      visit.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? visit.status === selectedStatus : true;
    const matchesActivity = selectedActivityType ? visit.activityType === selectedActivityType : true;
    
    return matchesSearch && matchesStatus && matchesActivity;
  });

  // Export data
  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Data berhasil diekspor ke ${format.toUpperCase()}`, {
      description: `File telah diunduh ke komputer Anda`,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus(null);
    setSelectedActivityType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Daftar Kunjungan</h1>
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
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, institusi, atau ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={selectedStatus || ""} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status Kunjungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">Semua Status</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="no_show">Tidak Hadir</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={selectedActivityType || ""} onValueChange={setSelectedActivityType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Jenis Kegiatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">Semua Kegiatan</SelectItem>
                    <SelectItem value="wisata_edukasi">Wisata Edukasi</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="camping">Camping</SelectItem>
                    <SelectItem value="field_trip">Field Trip</SelectItem>
                    <SelectItem value="penelitian">Penelitian</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">ID Pesanan</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Institusi/Grup
                    <ArrowUpDown className="ml-2 h-3 w-3 cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Tanggal Kunjungan
                    <ArrowUpDown className="ml-2 h-3 w-3 cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Jenis Kegiatan</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada data yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisits.map((visit) => {
                  const statusInfo = getStatusInfo(visit.status);
                  
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.id}</TableCell>
                      <TableCell>{visit.institutionName}</TableCell>
                      <TableCell>{visit.responsiblePerson}</TableCell>
                      <TableCell>
                        {format(visit.visitDate, 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-center">
                        {getActivityLabel(visit.activityType)}
                      </TableCell>
                      <TableCell className="text-center">{visit.totalVisitors}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={statusInfo.className}
                        >
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredVisits.length} dari {mockVisits.length} kunjungan
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled>
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitList;
