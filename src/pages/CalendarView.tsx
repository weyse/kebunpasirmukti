
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
type Visit = {
  id: string;
  institutionName: string;
  totalVisitors: number;
  activityType: string;
  date: Date;
};

// Mock data for visits
const mockVisits: Visit[] = [
  {
    id: 'PSD-RT1XA2',
    institutionName: 'SD Negeri 1 Cisarua',
    totalVisitors: 120,
    activityType: 'wisata_edukasi',
    date: new Date('2025-05-05'),
  },
  {
    id: 'PSD-MN2BX3',
    institutionName: 'TK Harapan Bunda',
    totalVisitors: 45,
    activityType: 'outbound',
    date: new Date('2025-05-07'),
  },
  {
    id: 'PSD-PS9CZ7',
    institutionName: 'Komunitas Pecinta Alam',
    totalVisitors: 25,
    activityType: 'camping',
    date: new Date('2025-05-10'),
  },
  {
    id: 'PSD-LK4DF5',
    institutionName: 'SMP Negeri 2 Bandung',
    totalVisitors: 86,
    activityType: 'field_trip',
    date: new Date('2025-05-15'),
  },
  {
    id: 'PSD-QW5EF6',
    institutionName: 'Keluarga Joko',
    totalVisitors: 4,
    activityType: 'wisata_edukasi',
    date: new Date('2025-05-20'),
  },
  {
    id: 'PSD-ZX7GH8',
    institutionName: 'PT Maju Bersama',
    totalVisitors: 32,
    activityType: 'outbound',
    date: new Date('2025-05-20'),
  },
];

// Helper functions
const getVisitsByDate = (date: Date, visits: Visit[]) => {
  return visits.filter(
    (visit) => format(visit.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );
};

const getActivityLabel = (type: string) => {
  const labels: Record<string, string> = {
    wisata_edukasi: 'Wisata Edukasi',
    outbound: 'Outbound',
    camping: 'Camping',
    field_trip: 'Field Trip',
    penelitian: 'Penelitian',
    lainnya: 'Lainnya',
  };
  return labels[type] || type;
};

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    wisata_edukasi: 'bg-blue-100 text-blue-800 border-blue-200',
    outbound: 'bg-green-100 text-green-800 border-green-200',
    camping: 'bg-amber-100 text-amber-800 border-amber-200',
    field_trip: 'bg-purple-100 text-purple-800 border-purple-200',
    penelitian: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    lainnya: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Component
const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedVisits, setSelectedVisits] = useState<Visit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const visitsOnDate = getVisitsByDate(date, mockVisits);
    setSelectedDate(date);
    setSelectedVisits(visitsOnDate);
    if (visitsOnDate.length > 0) {
      setDialogOpen(true);
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

      {viewMode === 'month' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Jadwal kunjungan untuk bulan {format(currentMonth, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center font-medium">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-start-${i}`} className="h-24 p-1 border border-transparent"></div>
              ))}

              {daysInMonth.map((day) => {
                const dayVisits = getVisitsByDate(day, mockVisits);
                const isCurrentDay = isToday(day);
                const isSameMonthDay = isSameMonth(day, currentMonth);
                const hasVisits = dayVisits.length > 0;
                
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-24 overflow-hidden border rounded-md p-1 cursor-pointer transition-colors",
                      isCurrentDay ? "border-pasirmukti-500" : "border-border",
                      isSameMonthDay ? "bg-card" : "bg-muted/50",
                      hasVisits ? "hover:border-pasirmukti-400" : "hover:bg-muted"
                    )}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className={cn(
                      "flex justify-center items-center h-6 w-6 rounded-full mb-1 mx-auto",
                      isCurrentDay ? "bg-pasirmukti-500 text-white" : ""
                    )}>
                      {format(day, 'd')}
                    </div>
                    <div className="overflow-y-auto max-h-[calc(100%-2rem)] space-y-1">
                      {dayVisits.map((visit, index) => (
                        <div
                          key={visit.id}
                          className="text-xs truncate bg-pasirmukti-100 text-pasirmukti-800 rounded px-1 py-0.5"
                        >
                          {visit.institutionName}
                        </div>
                      ))}
                    </div>
                    {dayVisits.length > 2 && (
                      <div className="text-xs text-center text-muted-foreground mt-1">
                        +{dayVisits.length - 2} lainnya
                      </div>
                    )}
                  </div>
                );
              })}

              {Array.from({ 
                length: 6 - endOfMonth(currentMonth).getDay()
              }).map((_, i) => (
                <div key={`empty-end-${i}`} className="h-24 p-1 border border-transparent"></div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div>
              <span className="inline-block h-3 w-3 rounded-full bg-pasirmukti-500 mr-1"></span>
              Hari ini
            </div>
            <div>
              Total: {mockVisits.length} kunjungan bulan ini
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kunjungan</CardTitle>
            <CardDescription>
              Menampilkan semua kunjungan yang terjadwal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVisits
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((visit) => (
                  <div 
                    key={visit.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSelectedDate(visit.date);
                      setSelectedVisits([visit]);
                      setDialogOpen(true);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3 w-14 h-14">
                        <div className="text-sm font-medium">{format(visit.date, 'dd')}</div>
                        <div className="text-xs">{format(visit.date, 'MMM')}</div>
                      </div>
                      <div>
                        <h3 className="font-medium">{visit.institutionName}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className={getActivityColor(visit.activityType)}>
                            {getActivityLabel(visit.activityType)}
                          </Badge>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {visit.totalVisitors} pengunjung
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
                
                {mockVisits.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada kunjungan yang terjadwal
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Kunjungan pada {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy')}
            </DialogTitle>
            <DialogDescription>
              {selectedVisits.length} kunjungan terjadwal pada tanggal ini
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {selectedVisits.map((visit) => (
              <div key={visit.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{visit.institutionName}</h3>
                  <Badge variant="outline" className={getActivityColor(visit.activityType)}>
                    {getActivityLabel(visit.activityType)}
                  </Badge>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-sm"><strong>ID:</strong> {visit.id}</p>
                  <p className="text-sm"><strong>Jumlah Pengunjung:</strong> {visit.totalVisitors} orang</p>
                  <p className="text-sm"><strong>Jenis Kegiatan:</strong> {getActivityLabel(visit.activityType)}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">Lihat Detail</Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
