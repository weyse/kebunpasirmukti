
import React, { useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  free_teachers: number;
  onParticipantChange: (type: 'adults' | 'children' | 'teachers' | 'free_teachers', count: number) => void;
  maxAdults?: number;
  maxChildren?: number;
  maxTeachers?: number;
  maxFreeTeachers?: number;
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
  free_teachers,
  onParticipantChange,
  maxAdults = Infinity,
  maxChildren = Infinity,
  maxTeachers = Infinity,
  maxFreeTeachers = Infinity
}) => {
  // Ensure we have valid values
  const safeAdults = isNaN(adults) ? 0 : adults;
  const safeChildren = isNaN(children) ? 0 : children;
  const safeTeachers = isNaN(teachers) ? 0 : teachers;
  const safeFreeTeachers = isNaN(free_teachers) ? 0 : free_teachers;
  
  // Debug: Log when component renders with new props
  useEffect(() => {
    if (checked) {
      console.log(`PackageSelectionCard ${id} rendered with:`, { 
        checked, adults: safeAdults, children: safeChildren, teachers: safeTeachers, free_teachers: safeFreeTeachers 
      });
    }
  }, [id, checked, safeAdults, safeChildren, safeTeachers, safeFreeTeachers]);

  const handleInputChange = (type: 'adults' | 'children' | 'teachers' | 'free_teachers', value: string) => {
    // Convert to number and ensure it's not negative
    const numValue = Math.max(0, parseInt(value) || 0);
    
    // Ensure the value doesn't exceed the maximum
    const maxValue = type === 'adults' 
      ? maxAdults 
      : type === 'children' 
        ? maxChildren 
        : type === 'teachers'
          ? maxTeachers
          : maxFreeTeachers;
    const validValue = Math.min(numValue, maxValue);
    
    onParticipantChange(type, validValue);
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
        <p className="ml-8 font-medium">Rp {(isNaN(price) ? 0 : price).toLocaleString()}</p>
      )}
      
      {checked && (
        <div className="mt-4 space-y-2 border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Jumlah Peserta</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor={`${id}-adults`} className="text-xs">Dewasa:</Label>
              <Input
                id={`${id}-adults`}
                type="number"
                min="0"
                max={maxAdults}
                value={safeAdults}
                onChange={(e) => handleInputChange('adults', e.target.value)}
                className="h-8 text-sm"
              />
              <div className="text-xs text-muted-foreground">Max: {maxAdults === Infinity ? '∞' : maxAdults}</div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor={`${id}-children`} className="text-xs">Anak-anak:</Label>
              <Input
                id={`${id}-children`}
                type="number"
                min="0"
                max={maxChildren}
                value={safeChildren}
                onChange={(e) => handleInputChange('children', e.target.value)}
                className="h-8 text-sm"
              />
              <div className="text-xs text-muted-foreground">Max: {maxChildren === Infinity ? '∞' : maxChildren}</div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor={`${id}-teachers`} className="text-xs">Guru:</Label>
              <Input
                id={`${id}-teachers`}
                type="number"
                min="0"
                max={maxTeachers}
                value={safeTeachers}
                onChange={(e) => handleInputChange('teachers', e.target.value)}
                className="h-8 text-sm"
              />
              <div className="text-xs text-muted-foreground">Max: {maxTeachers === Infinity ? '∞' : maxTeachers}</div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor={`${id}-free-teachers`} className="text-xs">Guru (Free):</Label>
              <Input
                id={`${id}-free-teachers`}
                type="number"
                min="0"
                max={maxFreeTeachers}
                value={safeFreeTeachers}
                onChange={(e) => handleInputChange('free_teachers', e.target.value)}
                className="h-8 text-sm"
              />
              <div className="text-xs text-muted-foreground">Max: {maxFreeTeachers === Infinity ? '∞' : maxFreeTeachers}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageSelectionCard;
