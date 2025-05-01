
import React from 'react';
import { Input } from "@/components/ui/input";

interface AccommodationCardProps {
  name: string;
  price: number;
  details: string;
  capacity: number;
  features: string[];
  count: number;
  onCountChange: (count: number) => void;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  name,
  price,
  details,
  capacity,
  features,
  count,
  onCountChange
}) => {
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onCountChange(isNaN(value) ? 0 : value);
  };

  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{name}</h3>
      </div>
      
      <div>
        <p className="font-medium">Rp {price.toLocaleString()} × 1 malam = Rp {price.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{details}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <span key={index} className="inline-block bg-secondary text-xs px-2 py-1 rounded-full">
            {feature}
          </span>
        ))}
      </div>
      
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <label htmlFor={`room-count-${name}`} className="text-sm font-medium">
            Jumlah Kamar:
          </label>
          <Input
            id={`room-count-${name}`}
            type="number"
            min="0"
            max={capacity} 
            value={count}
            onChange={handleCountChange}
            className="w-20 text-center"
          />
        </div>
        {count > 0 && (
          <p className="text-sm text-right text-muted-foreground mt-2">
            Kamar yang dipilih: {count} dari {capacity} tersedia
          </p>
        )}
      </div>
    </div>
  );
};

export default AccommodationCard;
