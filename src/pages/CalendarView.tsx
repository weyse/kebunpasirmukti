
import React, { useState } from 'react';
import { addMonths, subMonths, parseISO, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users } from 'lucide-react';

import { Visit } from '@/types/visit';
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
  
  const { visits, isLoading } = useCalendarData();

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
    }
  };

  const handleVisitClick = (visit: Visit) => {
    setSelectedDate(parseISO(visit.visit_date));
    setSelectedVisits([visit]);
    setDialogOpen(true);
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
            />
          </CardContent>
        </Card>
      )}

      <VisitDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        selectedVisits={selectedVisits}
      />
    </div>
  );
};

export default CalendarView;
