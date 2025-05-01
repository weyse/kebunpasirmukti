
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, ArrowUpDown, Filter, Eye, Edit, Trash, CalendarCheck, Loader2, Plus } from 'lucide-react';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define guest data types
type PaymentStatus = 'belum_lunas' | 'lunas';

type Guest = {
  id: string;
  order_id: string;
  responsible_person: string;
  institution_name: string;
  phone_number: string;
  total_visitors: number;
  visit_type: string;
  package_type: string;
  visit_date: string;
  payment_status: PaymentStatus;
  created_at: string;
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

// Helper function for package type labels
const getPackageLabel = (type: string): string => {
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

// Main component
const GuestRegistrationList = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [sortField, setSortField] = useState<string>('visit_date');
  const [sortDirection, setSortDirection] = useState<string>('desc');
  
  // Fetch guests data
  useEffect(() => {
    fetchGuestRegistrations();
  }, [sortField, sortDirection]);

  // Function to fetch guest registrations from Supabase
  const fetchGuestRegistrations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guest_registrations')
        .select('*, adult_count, children_count, teacher_count')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Process the data to match our Guest type
        const processedGuests = data.map(guest => ({
          id: guest.id,
          order_id: guest.order_id || '',
          responsible_person: guest.responsible_person,
          institution_name: guest.institution_name,
          phone_number: guest.phone_number,
          total_visitors: (guest.adult_count || 0) + (guest.children_count || 0) + (guest.teacher_count || 0),
          visit_type: guest.visit_type,
          package_type: guest.package_type,
          visit_date: guest.visit_date,
          payment_status: guest.payment_status,
          created_at: guest.created_at,
        }));
        
        setGuests(processedGuests);
      }
    } catch (error) {
      console.error('Error fetching guest registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load guest registrations data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter guests based on search and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.responsible_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.institution_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? guest.payment_status === selectedStatus : true;
    const matchesActivity = selectedActivityType ? guest.visit_type === selectedActivityType : true;
    
    return matchesSearch && matchesStatus && matchesActivity;
  });

  // Handle sorting
  const handleSort = (field: string) => {
    setIsSorting(true);
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for new field
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle guest deletion
  const handleDeleteGuest = async () => {
    if (guestToDelete) {
      try {
        const { error } = await supabase
          .from('guest_registrations')
          .delete()
          .eq('id', guestToDelete.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setGuests(guests.filter((guest) => guest.id !== guestToDelete.id));
        
        toast({
          title: 'Data tamu berhasil dihapus',
          description: `ID: ${guestToDelete.order_id}`,
        });
        
        setGuestToDelete(null);
      } catch (error) {
        console.error('Error deleting guest:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete guest registration',
          variant: 'destructive',
        });
      }
    }
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
        <h1 className="text-3xl font-bold">Registrasi Tamu</h1>
        <Button 
          className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
          onClick={() => navigate('/guest-registration/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrasi Baru
        </Button>
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
                  <SelectValue placeholder="Status Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">Semua Status</SelectItem>
                    <SelectItem value="lunas">Lunas</SelectItem>
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
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('institution_name')}>
                    Institusi/Grup
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('visit_date')}>
                    Tanggal Kunjungan
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Jenis Kegiatan</TableHead>
                <TableHead className="text-center">Paket</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-pasirmukti-500 mr-2" />
                      <span>Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredGuests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Tidak ada data yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.order_id || '-'}</TableCell>
                    <TableCell>{guest.institution_name}</TableCell>
                    <TableCell>{guest.responsible_person}</TableCell>
                    <TableCell>
                      {format(new Date(guest.visit_date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      {getActivityLabel(guest.visit_type)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getPackageLabel(guest.package_type)}
                    </TableCell>
                    <TableCell className="text-center">{guest.total_visitors}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`${
                          guest.payment_status === 'lunas'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {guest.payment_status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Buka menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/guest-registration/view/${guest.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/guest-registration/edit/${guest.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/check-in/${guest.id}`)}
                          >
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            Check-In
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setGuestToDelete(guest)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filteredGuests.length} dari {guests.length} registrasi
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

      <Dialog open={!!guestToDelete} onOpenChange={(open) => !open && setGuestToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data registrasi ini?
              <div className="mt-4 p-4 border rounded-md bg-muted">
                <p><strong>ID:</strong> {guestToDelete?.order_id}</p>
                <p><strong>Institusi:</strong> {guestToDelete?.institution_name}</p>
                <p><strong>Tanggal Kunjungan:</strong> {guestToDelete && format(new Date(guestToDelete.visit_date), 'dd MMMM yyyy')}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGuestToDelete(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGuest}
            >
              Hapus Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestRegistrationList;
