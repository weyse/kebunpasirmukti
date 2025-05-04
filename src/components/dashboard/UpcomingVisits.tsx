import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { UpcomingVisit } from '@/types/visit';

type UpcomingVisitsProps = {
  upcomingVisits: UpcomingVisit[];
  isLoading: boolean;
};

export const UpcomingVisits = ({ upcomingVisits, isLoading }: UpcomingVisitsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kunjungan Mendatang</CardTitle>
        <CardDescription>Kunjungan yang akan datang dalam waktu dekat</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : upcomingVisits.length > 0 ? (
          <div className="space-y-4">
            {upcomingVisits.map((visit) => (
              <div key={visit.id} className="flex items-center space-x-4">
                <div className="bg-pasirmukti-100 rounded-full p-2">
                  <Calendar className="h-5 w-5 text-pasirmukti-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{visit.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(visit.date), 'd MMMM yyyy', { locale: id })}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="rounded-full bg-pasirmukti-100 px-2.5 py-0.5 text-xs font-semibold text-pasirmukti-700">
                    {visit.count} orang
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada kunjungan mendatang
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => navigate('/visit-list')}>
          Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
