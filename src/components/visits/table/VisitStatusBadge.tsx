
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Visit } from '@/types/visit';

interface VisitStatusBadgeProps {
  status: Visit['payment_status'];
}

export function VisitStatusBadge({ status }: VisitStatusBadgeProps) {
  // Define styles for different status types
  const statusStyles = {
    lunas: 'bg-green-100 text-green-800 border-green-200',
    belum_lunas: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    // Add more status types if needed
  };

  // Get the appropriate style based on status, or fallback to default
  const statusStyle = status in statusStyles 
    ? statusStyles[status as keyof typeof statusStyles]
    : 'bg-gray-100 text-gray-800 border-gray-200';

  // Get the display label based on status
  const statusLabel = status === 'lunas' 
    ? 'Lunas' 
    : status === 'belum_lunas' 
      ? 'Belum Lunas' 
      : status; // Fallback to the raw status value

  return (
    <Badge
      variant="outline"
      className={statusStyle}
    >
      {statusLabel}
    </Badge>
  );
}
