
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

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
  return (
    <div className={`border rounded-md p-4 ${selected ? 'bg-primary/10 border-primary' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <Checkbox 
          id={`venue-${name}`}
          checked={selected} 
          onCheckedChange={onSelectionChange}
        />
        <label htmlFor={`venue-${name}`} className="flex-1 ml-2 font-medium cursor-pointer">{name}</label>
      </div>
      
      <div className="ml-6">
        <p className="text-sm">Kapasitas: {capacity} pax</p>
        <p className="font-medium text-sm">Rp {price.toLocaleString()}</p>
        
        <ul className="mt-2 space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="text-xs flex items-center">
              <span className="mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VenueCard;
