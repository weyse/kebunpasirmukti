
import React from 'react';
import { Eye, PenLine, Lock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CalendarPermission } from '@/types/calendarPermission';
import { useToast } from '@/hooks/use-toast';

interface AccessLevelControlProps {
  accessLevel: CalendarPermission;
  setAccessLevel: (value: CalendarPermission) => void;
  isAdmin: boolean;
}

export const AccessLevelControl = ({ 
  accessLevel, 
  setAccessLevel, 
  isAdmin 
}: AccessLevelControlProps) => {
  const { toast } = useToast();
  
  if (!isAdmin) return null;
  
  const handleAccessLevelChange = (value: CalendarPermission) => {
    // Only allow admins to change access level
    if (isAdmin) {
      setAccessLevel(value);
      toast({
        title: "Level Akses Diubah",
        description: `Level akses kalender diubah ke ${getAccessLevelLabel(value)}`,
      });
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Level Akses</h3>
      <RadioGroup 
        value={accessLevel} 
        onValueChange={handleAccessLevelChange as (value: string) => void} 
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="view" id="view" />
          <Label htmlFor="view" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Lihat
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="edit" id="edit" />
          <Label htmlFor="edit" className="flex items-center">
            <PenLine className="h-4 w-4 mr-2" />
            Edit
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="admin" id="admin" />
          <Label htmlFor="admin" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Admin
          </Label>
        </div>
      </RadioGroup>
      <div className="mt-2">
        <Badge className="bg-muted text-muted-foreground">
          {getAccessLevelIcon(accessLevel)}
          <span className="ml-1">{getAccessLevelLabel(accessLevel)}</span>
        </Badge>
      </div>
    </Card>
  );
};

// Helper functions for access level labels and icons
const getAccessLevelLabel = (level: CalendarPermission): string => {
  switch (level) {
    case 'admin':
      return 'Admin (Akses Penuh)';
    case 'edit':
      return 'Edit (Dapat Mengubah)';
    case 'view':
      return 'Lihat (Hanya Melihat)';
    default:
      return 'Tidak Diketahui';
  }
};

const getAccessLevelIcon = (level: CalendarPermission) => {
  switch (level) {
    case 'admin':
      return <Lock className="h-4 w-4" />;
    case 'edit':
      return <PenLine className="h-4 w-4" />;
    case 'view':
      return <Eye className="h-4 w-4" />;
    default:
      return null;
  }
};
