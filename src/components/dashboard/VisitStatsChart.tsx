
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

type VisitStatsChartProps = {
  data: { name: string; visitors: number }[];
  isLoading: boolean;
};

export const VisitStatsChart = ({ data, isLoading }: VisitStatsChartProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Statistik Kunjungan</CardTitle>
        <CardDescription>Jumlah pengunjung per bulan</CardDescription>
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
