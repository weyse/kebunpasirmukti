
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilihan Venue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => (
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
      </CardContent>
    </Card>
  );
};

export default VenueSelectionForm;
