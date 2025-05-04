
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AccommodationCard from '@/components/registration/AccommodationCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  nightsCount?: number;
  onNightsCountChange?: (count: number) => void;
}

const AccommodationSelectionForm: React.FC<AccommodationSelectionFormProps> = ({ 
  accommodations,
  accommodationCounts,
  extraBedCounts,
  onAccommodationChange,
  onExtraBedChange,
  nightsCount = 1,
  onNightsCountChange
}) => {
  const handleNightsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (onNightsCountChange && !isNaN(value) && value > 0) {
      onNightsCountChange(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jumlah Malam Menginap</CardTitle>
        <CardDescription className="text-muted-foreground">
          Harga yang ditampilkan adalah per malam × {nightsCount} malam
        </CardDescription>
        
        <div className="flex items-center mt-2">
          <Label htmlFor="nights-count" className="mr-3">Jumlah Malam:</Label>
          <Input
            id="nights-count"
            type="number"
            min="1"
            value={nightsCount}
            onChange={handleNightsChange}
            className="w-20"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accommodations.map(accommodation => (
            <AccommodationCard
              key={accommodation.id}
              name={accommodation.name}
              price={accommodation.price * nightsCount}
              details={accommodation.details}
              capacity={accommodation.capacity}
              features={accommodation.features}
              count={accommodationCounts[accommodation.id] || 0}
              extraBedCount={extraBedCounts[accommodation.id] || 0}
              onCountChange={(count) => onAccommodationChange(accommodation.id, count)}
              onExtraBedChange={(count) => onExtraBedChange(accommodation.id, count)}
              nightsCount={nightsCount}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccommodationSelectionForm;
