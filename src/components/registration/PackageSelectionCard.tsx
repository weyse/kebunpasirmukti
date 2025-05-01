
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PackageSelectionCardProps {
  id: string;
  title: string;
  description?: string;
  price?: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const PackageSelectionCard: React.FC<PackageSelectionCardProps> = ({
  id,
  title,
  description,
  price,
  checked,
  onCheckedChange
}) => {
  return (
    <div className={`border rounded-md p-4 flex flex-col space-y-2 ${checked ? 'bg-primary/10 border-primary' : ''}`}>
      <div className="flex items-center space-x-3">
        <Checkbox 
          id={id}
          checked={checked} 
          onCheckedChange={onCheckedChange} 
          className="h-5 w-5"
        />
        <Label htmlFor={id} className="flex-1 font-medium text-lg cursor-pointer">{title}</Label>
      </div>
      
      <div className="ml-8 space-y-2">
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        {price !== undefined && (
          <p className="font-medium">Rp {price.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default PackageSelectionCard;
