
import React, { useState } from 'react';
import { addMonths, subMonths, parseISO, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Lock, Eye, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import { Visit } from '@/types/visit';
import { CalendarPermission } from '@/types/calendarPermission';
import { useCalendarData } from '@/hooks/useCalendarData';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { VisitListView } from '@/components/calendar/VisitListView';
import { VisitDetailsDialog } from '@/components/calendar/VisitDetailsDialog';

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedVisits, setSelectedVisits] = useState<Visit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [accessLevel, setAccessLevel] = useState<CalendarPermission>('view');
  
  const { visits, isLoading } = useCalendarData();
  const { toast } = useToast();

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const visitsOnDate = visits.filter(
      (visit) => format(parseISO(visit.visit_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    setSelectedDate(date);
    setSelectedVisits(visitsOnDate);
    if (visitsOnDate.length > 0) {
      setDialogOpen(true);
    } else if (accessLevel === 'admin' || accessLevel === 'edit') {
      // For admin and edit access levels, allow creating new visits
      // This would typically navigate to the visit creation page with the date pre-selected
      // For now, just show a toast notification
      toast({
        title: "Tambah Kunjungan Baru",
        description: `Anda dapat menambahkan kunjungan pada tanggal ${format(date, 'dd MMMM yyyy')}`,
      });
    }
  };

  const handleVisitClick = (visit: Visit) => {
    setSelectedDate(parseISO(visit.visit_date));
    setSelectedVisits([visit]);
    setDialogOpen(true);
  };

  const handleAccessLevelChange = (value: CalendarPermission) => {
    setAccessLevel(value);
    toast({
      title: "Level Akses Diubah",
      description: `Level akses kalender diubah ke ${getAccessLevelLabel(value)}`,
    });
  };

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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Kalender Kunjungan</h1>
        <Tabs defaultValue="month" className="w-[200px]">
          <TabsList>
            <TabsTrigger 
              value="month" 
              onClick={() => setViewMode('month')}
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Bulan
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              onClick={() => setViewMode('list')}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Daftar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Level Akses</h3>
        <RadioGroup value={accessLevel} onValueChange={handleAccessLevelChange as (value: string) => void} className="flex space-x-4">
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

      {isLoading ? (
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'month' ? (
        <Card>
          <CardHeader>
            <CardDescription>
              Jadwal kunjungan untuk bulan {format(currentMonth, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarGrid
              currentMonth={currentMonth}
              visits={visits}
              onDateClick={handleDateClick}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              accessLevel={accessLevel}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardDescription>
              Menampilkan semua kunjungan yang terjadwal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VisitListView 
              visits={visits} 
              onVisitClick={handleVisitClick} 
              accessLevel={accessLevel}
            />
          </CardContent>
        </Card>
      )}

      <VisitDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        selectedVisits={selectedVisits}
        accessLevel={accessLevel}
      />
    </div>
  );
};

export default CalendarView;
