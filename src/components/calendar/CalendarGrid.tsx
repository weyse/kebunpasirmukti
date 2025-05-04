
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Visit } from '@/types/visit';
import { CalendarPermission } from '@/types/calendarPermission';
import { getVisitsByDate } from '@/utils/calendarHelpers';

interface CalendarGridProps {
  currentMonth: Date;
  visits: Visit[];
  onDateClick: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  accessLevel?: CalendarPermission;
}

export const CalendarGrid = ({ 
  currentMonth, 
  visits, 
  onDateClick,
  onPreviousMonth,
  onNextMonth,
  accessLevel = 'view'
}: CalendarGridProps) => {
  const daysInMonth = useMemo(() => eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  }), [currentMonth]);

  const visitsInCurrentMonth = useMemo(() => visits.filter(visit => {
    const visitDate = new Date(visit.visit_date);
    return isSameMonth(visitDate, currentMonth);
  }), [visits, currentMonth]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center font-medium mt-4">
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
          const dayVisits = getVisitsByDate(day, visits);
          const isCurrentDay = isToday(day);
          const isSameMonthDay = isSameMonth(day, currentMonth);
          const hasVisits = dayVisits.length > 0;
          const canEdit = accessLevel === 'admin' || accessLevel === 'edit';
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "h-24 overflow-hidden border rounded-md p-1",
                isCurrentDay ? "border-pasirmukti-500" : "border-border",
                isSameMonthDay ? "bg-card" : "bg-muted/50",
                hasVisits ? "hover:border-pasirmukti-400" : "hover:bg-muted",
                canEdit ? "cursor-pointer" : hasVisits ? "cursor-pointer" : "cursor-default"
              )}
              onClick={() => (canEdit || hasVisits) && onDateClick(day)}
              title={canEdit ? "Klik untuk menambah atau melihat kunjungan" : hasVisits ? "Klik untuk melihat kunjungan" : ""}
            >
              <div className={cn(
                "flex justify-center items-center h-6 w-6 rounded-full mb-1 mx-auto",
                isCurrentDay ? "bg-pasirmukti-500 text-white" : ""
              )}>
                {format(day, 'd')}
              </div>
              <div className="overflow-y-auto max-h-[calc(100%-2rem)] space-y-1">
                {dayVisits.slice(0, 2).map((visit) => (
                  <div
                    key={visit.id}
                    className="text-xs truncate bg-pasirmukti-100 text-pasirmukti-800 rounded px-1 py-0.5"
                  >
                    {visit.institution_name}
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
      
      <div className="flex justify-between text-sm text-muted-foreground mt-4">
        <div>
          <span className="inline-block h-3 w-3 rounded-full bg-pasirmukti-500 mr-1"></span>
          Hari ini
        </div>
        <div>
          Total: {visitsInCurrentMonth.length} kunjungan bulan ini
        </div>
      </div>
    </>
  );
};
