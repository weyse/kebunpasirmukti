
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Visit } from '@/types/visit';

interface VisitStatusBadgeProps {
  status: Visit['payment_status'];
}

export function VisitStatusBadge({ status }: VisitStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${
        status === 'lunas'
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
      }`}
    >
      {status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
    </Badge>
  );
}
