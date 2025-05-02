
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CalendarDays, Calendar, CalendarRange, CalendarClock } from 'lucide-react';
import { ChartPeriod, VisitorChartData } from '@/types/visit';

type VisitStatsChartProps = {
  data: VisitorChartData[];
  isLoading: boolean;
  selectedPeriod: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
};

export const VisitStatsChart = ({ 
  data, 
  isLoading, 
  selectedPeriod,
  onPeriodChange 
}: VisitStatsChartProps) => {
  
  // Get proper title based on selected period
  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case 'day':
        return 'Jumlah pengunjung per hari';
      case 'week':
        return 'Jumlah pengunjung per minggu';
      case 'month':
        return 'Jumlah pengunjung per bulan';
      case 'year':
        return 'Jumlah pengunjung per tahun';
    }
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Statistik Kunjungan</CardTitle>
            <CardDescription>{getPeriodTitle()}</CardDescription>
          </div>
          
          <ToggleGroup 
            type="single" 
            value={selectedPeriod}
            onValueChange={(value) => value && onPeriodChange(value as ChartPeriod)}
            className="!flex flex-wrap gap-1"
          >
            <ToggleGroupItem value="day" aria-label="Hari">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Hari</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="week" aria-label="Minggu">
              <CalendarRange className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Minggu</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="month" aria-label="Bulan">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Bulan</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="year" aria-label="Tahun">
              <CalendarClock className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Tahun</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 w-full flex items-center justify-center">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#40916c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
