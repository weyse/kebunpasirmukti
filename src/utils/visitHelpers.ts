
/**
 * Helper functions for visit-related operations
 */

// Helper function for activity type labels
export const getActivityLabel = (type: string): string => {
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

// Helper function for status labels and colors
export const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    lunas: {
      label: 'Selesai',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    belum_lunas: {
      label: 'Belum Lunas',
      className: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  };
  return statusMap[status] || { label: status, className: '' };
};

// Helper function for activity colors
export const getActivityColor = (type: string) => {
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
