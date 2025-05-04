
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface VisitFiltersProps {
  searchTerm: string;
  selectedStatus: string | null;
  selectedActivityType: string | null;
  setSearchTerm: (value: string) => void;
  setSelectedStatus: (value: string) => void;
  setSelectedActivityType: (value: string) => void;
  resetFilters: () => void;
}

export const VisitFilters: React.FC<VisitFiltersProps> = ({
  searchTerm,
  selectedStatus,
  selectedActivityType,
  setSearchTerm,
  setSelectedStatus,
  setSelectedActivityType,
  resetFilters,
}) => {
  return (
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
          <Select 
            value={selectedStatus || ""} 
            onValueChange={setSelectedStatus}
          >
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
          
          <Select 
            value={selectedActivityType || ""} 
            onValueChange={setSelectedActivityType}
          >
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
  );
};
