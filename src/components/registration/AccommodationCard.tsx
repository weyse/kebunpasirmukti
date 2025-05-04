
import React from 'react';
import { Input } from "@/components/ui/input";
import { BedDouble, Plus } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AccommodationCardProps {
  name: string;
  price: number;
  details: string;
  capacity: number;
  features: string[];
  count: number;
  extraBedCount: number;
  onCountChange: (count: number) => void;
  onExtraBedChange: (count: number) => void;
  nightsCount?: number;
}

const EXTRA_BED_PRICE = 160000;

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  name,
  price,
  details,
  capacity,
  features,
  count,
  extraBedCount,
  onCountChange,
  onExtraBedChange,
  nightsCount = 1
}) => {
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onCountChange(isNaN(value) ? 0 : value);
  };

  const handleExtraBedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onExtraBedChange(isNaN(value) ? 0 : Math.min(value, count * 2));
  };

  // Calculate price per night (original price provided is already for all nights)
  const pricePerNight = price / nightsCount;

  // Calculate total price including extra beds
  const roomPrice = price * count;
  const extraBedPrice = EXTRA_BED_PRICE * extraBedCount * nightsCount;
  const totalPrice = roomPrice + extraBedPrice;

  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{name}</h3>
      </div>
      
      <div>
        <p className="font-medium">Rp {pricePerNight.toLocaleString()} × {nightsCount} malam = Rp {price.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{details}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <span key={index} className="inline-block bg-secondary text-xs px-2 py-1 rounded-full">
            {feature}
          </span>
        ))}
      </div>
      
      <div className="pt-2 space-y-3">
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
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4" />
                <label htmlFor={`extra-bed-${name}`} className="text-sm font-medium">
                  Extra Bed (Rp {EXTRA_BED_PRICE.toLocaleString()}/bed × {nightsCount} malam):
                </label>
              </div>
              <Input
                id={`extra-bed-${name}`}
                type="number"
                min="0"
                max={count * 2} 
                value={extraBedCount}
                onChange={handleExtraBedChange}
                className="w-20 text-center"
              />
            </div>
            
            {extraBedCount > 0 && (
              <div className="text-sm text-right text-green-600">
                Extra Bed: {extraBedCount} × Rp {EXTRA_BED_PRICE.toLocaleString()} × {nightsCount} malam = Rp {extraBedPrice.toLocaleString()}
              </div>
            )}
            
            <div className="pt-1 border-t">
              <p className="text-sm text-right font-medium">
                Total: Rp {totalPrice.toLocaleString()}
              </p>
            </div>
            
            <p className="text-sm text-right text-muted-foreground">
              Kamar yang dipilih: {count} dari {capacity} tersedia
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccommodationCard;
