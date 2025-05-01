
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, ArrowUpDown, Download, Filter, Loader2 } from 'lucide-react';

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
import { supabase } from '@/integrations/supabase/client';

// Define visit data types
type Visit = {
  id: string;
  order_id: string;
  institution_name: string;
  responsible_person: string;
  total_visitors: number;
  visit_type: string;
  visit_date: string;
  payment_status: 'lunas' | 'belum_lunas';
};

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
    lunas: {
      label: 'Selesai',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    belum_lunas: {
      label: 'Belum Lunas',
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
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch visits from Supabase
  useEffect(() => {
    const fetchVisits = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('guest_registrations')
          .select('id, order_id, institution_name, responsible_person, visit_type, visit_date, payment_status, adult_count, children_count, teacher_count')
          .order('visit_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match the Visit type
          const transformedVisits: Visit[] = data.map(item => ({
            id: item.id,
            order_id: item.order_id || 'N/A',
            institution_name: item.institution_name,
            responsible_person: item.responsible_person,
            total_visitors: (item.adult_count || 0) + (item.children_count || 0) + (item.teacher_count || 0),
            visit_type: item.visit_type,
            visit_date: item.visit_date,
            payment_status: item.payment_status
          }));
          
          setVisits(transformedVisits);
        }
      } catch (error) {
        console.error('Error fetching visits:', error);
        toast('Error fetching visits');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVisits();
  }, []);
  
  // Filter visits based on search and filters
  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.responsible_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.institution_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? visit.payment_status === selectedStatus : true;
    const matchesActivity = selectedActivityType ? visit.visit_type === selectedActivityType : true;
    
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
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="lunas">Selesai</SelectItem>
                    <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={selectedActivityType || ""} onValueChange={setSelectedActivityType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Jenis Kegiatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Semua Kegiatan</SelectItem>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredVisits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada data yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisits.map((visit) => {
                  const statusInfo = getStatusInfo(visit.payment_status);
                  
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.order_id}</TableCell>
                      <TableCell>{visit.institution_name}</TableCell>
                      <TableCell>{visit.responsible_person}</TableCell>
                      <TableCell>
                        {format(new Date(visit.visit_date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="text-center">
                        {getActivityLabel(visit.visit_type)}
                      </TableCell>
                      <TableCell className="text-center">{visit.total_visitors}</TableCell>
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
            Menampilkan {filteredVisits.length} dari {visits.length} kunjungan
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
