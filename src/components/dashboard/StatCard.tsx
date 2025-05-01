
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  isLoading?: boolean;
  iconColor?: string;
};

export const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  isLoading = false,
  iconColor = "text-pasirmukti-500"
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change !== undefined && (
              <p className="text-xs text-muted-foreground">
                {change >= 0 ? '+' : ''}{change}% dari bulan sebelumnya
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
