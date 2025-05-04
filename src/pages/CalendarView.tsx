
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

import { Visit } from '@/types/visit';
import { CalendarPermission } from '@/types/calendarPermission';
import { useCalendarData } from '@/hooks/useCalendarData';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { VisitListView } from '@/components/calendar/VisitListView';
import { VisitDetailsDialog } from '@/components/calendar/VisitDetailsDialog';
import { useAuth } from '@/context/AuthContext';
import { ViewModeTabs } from '@/components/calendar/ViewModeTabs';
import { AccessLevelControl } from '@/components/calendar/AccessLevelControl';
import { CalendarLoadingState } from '@/components/calendar/CalendarLoadingState';

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedVisits, setSelectedVisits] = useState<Visit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [accessLevel, setAccessLevel] = useState<CalendarPermission>('view');
  
  const { visits, isLoading } = useCalendarData();
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  // If the user is not an admin, force view-only access level
  useEffect(() => {
    if (!isAdmin) {
      setAccessLevel('view');
    }
  }, [isAdmin]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
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

  const handleViewModeChange = (mode: 'month' | 'list') => {
    setViewMode(mode);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Kalender Kunjungan</h1>
        <ViewModeTabs value={viewMode} onChange={handleViewModeChange} />
      </div>

      <AccessLevelControl 
        accessLevel={accessLevel}
        setAccessLevel={setAccessLevel}
        isAdmin={isAdmin}
      />

      {isLoading ? (
        <CalendarLoadingState />
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
