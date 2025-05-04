
import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViewModeTabsProps {
  value: 'month' | 'list';
  onChange: (value: 'month' | 'list') => void;
}

export const ViewModeTabs = ({ value, onChange }: ViewModeTabsProps) => {
  return (
    <Tabs defaultValue={value} className="w-[200px]">
      <TabsList>
        <TabsTrigger 
          value="month" 
          onClick={() => onChange('month')}
          className="flex-1"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Bulan
        </TabsTrigger>
        <TabsTrigger 
          value="list" 
          onClick={() => onChange('list')}
          className="flex-1"
        >
          <Users className="h-4 w-4 mr-2" />
          Daftar
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
