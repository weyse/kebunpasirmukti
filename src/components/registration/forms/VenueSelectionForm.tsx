
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import VenueCard from '@/components/registration/VenueCard';

interface Venue {
  id: string;
  name: string;
  capacity: number;
  price: number;
  features: string[];
}

interface VenueSelectionFormProps {
  venues: Venue[];
  selectedVenues: string[];
  onVenueChange: (id: string, selected: boolean) => void;
}

const VenueSelectionForm: React.FC<VenueSelectionFormProps> = ({ 
  venues,
  selectedVenues,
  onVenueChange
}) => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<"name" | "capacity" | "price">("name");

  // Filter venues based on search input
  const filteredVenues = venues.filter(venue => 
    venue.name.toLowerCase().includes(filter.toLowerCase()) ||
    venue.features.some(feature => feature.toLowerCase().includes(filter.toLowerCase()))
  );

  // Sort venues based on selected sort option
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (sort === "capacity") return b.capacity - a.capacity;
    if (sort === "price") return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilihan Venue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari venue atau fasilitas..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={sort}
              onValueChange={(value) => setSort(value as "name" | "capacity" | "price")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="capacity">Kapasitas (tinggi ke rendah)</SelectItem>
                <SelectItem value="price">Harga (rendah ke tinggi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVenues.map(venue => (
            <VenueCard
              key={venue.id}
              name={venue.name}
              capacity={venue.capacity}
              price={venue.price}
              features={venue.features}
              selected={selectedVenues.includes(venue.id)}
              onSelectionChange={(selected) => onVenueChange(venue.id, selected)}
            />
          ))}
        </div>
        
        {sortedVenues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada venue yang sesuai dengan kriteria pencarian.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VenueSelectionForm;
