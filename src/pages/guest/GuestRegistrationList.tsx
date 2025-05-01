
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, ArrowUpDown, Filter, Eye, Edit, Trash, CalendarCheck } from 'lucide-react';

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
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
import { toast } from 'sonner';

// Define guest data types
type PaymentStatus = 'belum_lunas' | 'lunas';

type Guest = {
  id: string;
  responsiblePerson: string;
  institutionName: string;
  phoneNumber: string;
  email: string;
  totalVisitors: number;
  activityType: string;
  visitDate: Date;
  paymentStatus: PaymentStatus;
};

// Mock data for the guest list
const mockGuests: Guest[] = [
  {
    id: 'PSD-RT1XA2',
    responsiblePerson: 'Ahmad Yani',
    institutionName: 'SD Negeri 1 Cisarua',
    phoneNumber: '081234567890',
    email: 'sdnegericisarua@edu.id',
    totalVisitors: 120,
    activityType: 'wisata_edukasi',
    visitDate: new Date('2025-05-05'),
    paymentStatus: 'belum_lunas',
  },
  {
    id: 'PSD-MN2BX3',
    responsiblePerson: 'Siti Nurhaliza',
    institutionName: 'TK Harapan Bunda',
    phoneNumber: '082345678901',
    email: 'tk.harapanbunda@edu.id',
    totalVisitors: 45,
    activityType: 'outbound',
    visitDate: new Date('2025-05-07'),
    paymentStatus: 'lunas',
  },
  {
    id: 'PSD-PS9CZ7',
    responsiblePerson: 'Budi Santoso',
    institutionName: 'Komunitas Pecinta Alam',
    phoneNumber: '083456789012',
    email: 'komunitas.pa@gmail.com',
    totalVisitors: 25,
    activityType: 'camping',
    visitDate: new Date('2025-05-10'),
    paymentStatus: 'lunas',
  },
  {
    id: 'PSD-LK4DF5',
    responsiblePerson: 'Diana Putri',
    institutionName: 'SMP Negeri 2 Bandung',
    phoneNumber: '084567890123',
    email: 'smpn2bandung@edu.id',
    totalVisitors: 86,
    activityType: 'field_trip',
    visitDate: new Date('2025-05-15'),
    paymentStatus: 'belum_lunas',
  },
  {
    id: 'PSD-QW5EF6',
    responsiblePerson: 'Joko Widodo',
    institutionName: 'Keluarga Joko',
    phoneNumber: '085678901234',
    email: 'joko.widodo@gmail.com',
    totalVisitors: 4,
    activityType: 'wisata_edukasi',
    visitDate: new Date('2025-05-20'),
    paymentStatus: 'lunas',
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

// Main component
const GuestRegistrationList = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  
  // Filter guests based on search and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? guest.paymentStatus === selectedStatus : true;
    const matchesActivity = selectedActivityType ? guest.activityType === selectedActivityType : true;
    
    return matchesSearch && matchesStatus && matchesActivity;
  });

  // Handle guest deletion
  const handleDeleteGuest = () => {
    if (guestToDelete) {
      setGuests(guests.filter((guest) => guest.id !== guestToDelete.id));
      toast.success('Data tamu berhasil dihapus', {
        description: `ID: ${guestToDelete.id}`,
      });
      setGuestToDelete(null);
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
          + Registrasi Baru
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
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Tidak ada data yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              ) : (
                filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.id}</TableCell>
                    <TableCell>{guest.institutionName}</TableCell>
                    <TableCell>{guest.responsiblePerson}</TableCell>
                    <TableCell>
                      {format(guest.visitDate, 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      {getActivityLabel(guest.activityType)}
                    </TableCell>
                    <TableCell className="text-center">{guest.totalVisitors}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`${
                          guest.paymentStatus === 'lunas'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {guest.paymentStatus === 'lunas' ? 'Lunas' : 'Belum Lunas'}
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
                            onClick={() => navigate(`/guest-registration/${guest.id}`)}
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
                <p><strong>ID:</strong> {guestToDelete?.id}</p>
                <p><strong>Institusi:</strong> {guestToDelete?.institutionName}</p>
                <p><strong>Tanggal Kunjungan:</strong> {guestToDelete && format(guestToDelete.visitDate, 'dd MMMM yyyy')}</p>
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
