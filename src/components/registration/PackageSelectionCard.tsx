
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackageSelectionCardProps {
  id: string;
  title: string;
  description?: string;
  price?: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  adults: number;
  children: number;
  teachers: number;
  onParticipantChange: (type: 'adults' | 'children' | 'teachers', count: number) => void;
  maxAdults?: number;
  maxChildren?: number;
  maxTeachers?: number;
}

const PackageSelectionCard: React.FC<PackageSelectionCardProps> = ({
  id,
  title,
  description,
  price,
  checked,
  onCheckedChange,
  adults,
  children,
  teachers,
  onParticipantChange,
  maxAdults = Infinity,
  maxChildren = Infinity,
  maxTeachers = Infinity
}) => {
  const handleIncrement = (type: 'adults' | 'children' | 'teachers') => {
    const currentValue = type === 'adults' ? adults : type === 'children' ? children : teachers;
    const maxValue = type === 'adults' ? maxAdults : type === 'children' ? maxChildren : maxTeachers;
    
    if (currentValue < maxValue) {
      onParticipantChange(type, currentValue + 1);
    }
  };

  const handleDecrement = (type: 'adults' | 'children' | 'teachers') => {
    const currentValue = type === 'adults' ? adults : type === 'children' ? children : teachers;
    if (currentValue > 0) {
      onParticipantChange(type, currentValue - 1);
    }
  };

  return (
    <div className={`border rounded-md p-4 flex flex-col space-y-3 ${checked ? 'bg-primary/10 border-primary' : ''}`}>
      <div className="flex items-center space-x-3">
        <Checkbox 
          id={id}
          checked={checked} 
          onCheckedChange={onCheckedChange} 
          className="h-5 w-5"
        />
        <Label htmlFor={id} className="flex-1 font-medium text-lg cursor-pointer">{title}</Label>
      </div>
      
      {description && (
        <p className="ml-8 text-sm text-muted-foreground">{description}</p>
      )}
      
      {price !== undefined && (
        <p className="ml-8 font-medium">Rp {price.toLocaleString()}</p>
      )}
      
      {checked && (
        <div className="mt-4 space-y-2 border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Jumlah Peserta</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Dewasa:</span>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleDecrement('adults')}
                disabled={adults <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-8 text-center">{adults}</span>
              
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleIncrement('adults')}
                disabled={adults >= maxAdults}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Anak-anak:</span>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleDecrement('children')}
                disabled={children <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-8 text-center">{children}</span>
              
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleIncrement('children')}
                disabled={children >= maxChildren}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Guru:</span>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleDecrement('teachers')}
                disabled={teachers <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-8 text-center">{teachers}</span>
              
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleIncrement('teachers')}
                disabled={teachers >= maxTeachers}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageSelectionCard;
