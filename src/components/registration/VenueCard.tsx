
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface VenueCardProps {
  name: string;
  capacity: number;
  price: number;
  features: string[];
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({
  name,
  capacity,
  price,
  features,
  selected,
  onSelectionChange
}) => {
  const id = `venue-${name.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div className={`border rounded-md p-4 flex flex-col space-y-2 ${selected ? 'bg-primary/10 border-primary' : ''}`}>
      <div className="flex items-center space-x-3">
        <Checkbox 
          id={id}
          checked={selected} 
          onCheckedChange={onSelectionChange} 
          className="h-5 w-5"
        />
        <Label htmlFor={id} className="flex-1 font-medium text-lg cursor-pointer">{name}</Label>
      </div>
      
      <div className="ml-8 space-y-2">
        <p className="text-sm text-muted-foreground">Kapasitas: {capacity} pax</p>
        <p className="font-medium">Rp {price.toLocaleString()}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {features.map((feature, index) => (
            <span 
              key={index} 
              className="inline-block text-xs bg-secondary px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
