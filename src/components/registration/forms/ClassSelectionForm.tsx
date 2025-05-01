
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClassSelectionGroup from '@/components/registration/ClassSelectionGroup';

interface ClassOption {
  id: string;
  label: string;
}

interface ClassSelectionFormProps {
  selectedClasses: string[];
  onClassChange: (classes: string[]) => void;
  classOptions: ClassOption[];
}

const ClassSelectionForm: React.FC<ClassSelectionFormProps> = ({ 
  selectedClasses,
  onClassChange,
  classOptions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilihan Kelas yang Berkunjung</CardTitle>
      </CardHeader>
      <CardContent>
        <ClassSelectionGroup
          title=""
          options={classOptions}
          selectedClasses={selectedClasses}
          onClassChange={onClassChange}
        />
      </CardContent>
    </Card>
  );
};

export default ClassSelectionForm;
