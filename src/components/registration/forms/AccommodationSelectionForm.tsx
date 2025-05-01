
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AccommodationCard from '@/components/registration/AccommodationCard';

interface Accommodation {
  id: string;
  name: string;
  price: number;
  details: string;
  capacity: number;
  features: string[];
}

interface AccommodationSelectionFormProps {
  accommodations: Accommodation[];
  accommodationCounts: Record<string, number>;
  extraBedCounts: Record<string, number>;
  onAccommodationChange: (id: string, count: number) => void;
  onExtraBedChange: (id: string, count: number) => void;
}

const AccommodationSelectionForm: React.FC<AccommodationSelectionFormProps> = ({ 
  accommodations,
  accommodationCounts,
  extraBedCounts,
  onAccommodationChange,
  onExtraBedChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jumlah Malam Menginap</CardTitle>
        <CardDescription className="text-muted-foreground">
          Harga yang ditampilkan adalah per malam × 1 malam
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accommodations.map(accommodation => (
            <AccommodationCard
              key={accommodation.id}
              name={accommodation.name}
              price={accommodation.price}
              details={accommodation.details}
              capacity={accommodation.capacity}
              features={accommodation.features}
              count={accommodationCounts[accommodation.id] || 0}
              extraBedCount={extraBedCounts[accommodation.id] || 0}
              onCountChange={(count) => onAccommodationChange(accommodation.id, count)}
              onExtraBedChange={(count) => onExtraBedChange(accommodation.id, count)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccommodationSelectionForm;
