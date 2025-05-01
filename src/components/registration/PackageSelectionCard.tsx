
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface PackageSelectionCardProps {
  id: string;
  title: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const PackageSelectionCard: React.FC<PackageSelectionCardProps> = ({
  id,
  title,
  checked,
  onCheckedChange
}) => {
  return (
    <div className={`border rounded-md p-4 flex items-center space-x-4 ${checked ? 'bg-primary/10 border-primary' : ''}`}>
      <Checkbox 
        id={id}
        checked={checked} 
        onCheckedChange={onCheckedChange} 
      />
      <label htmlFor={id} className="flex-1 font-medium cursor-pointer">{title}</label>
    </div>
  );
};

export default PackageSelectionCard;
