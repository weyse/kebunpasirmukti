
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ClassOption {
  id: string;
  label: string;
}

interface ClassSelectionGroupProps {
  title: string;
  options: ClassOption[];
  selectedClasses: string[];
  onClassChange: (selectedClasses: string[]) => void;
}

const ClassSelectionGroup: React.FC<ClassSelectionGroupProps> = ({
  title,
  options,
  selectedClasses,
  onClassChange
}) => {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      onClassChange([...selectedClasses, id]);
    } else {
      onClassChange(selectedClasses.filter(classId => classId !== id));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={option.id}
              checked={selectedClasses.includes(option.id)}
              onCheckedChange={(checked) => handleCheckboxChange(option.id, !!checked)}
            />
            <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSelectionGroup;
