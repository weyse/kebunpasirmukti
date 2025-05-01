
import React from 'react';
import { useVisitData } from '@/hooks/useVisitData';
import { VisitFilters } from '@/components/visits/VisitFilters';
import { VisitTable } from '@/components/visits/VisitTable';
import { VisitPagination } from '@/components/visits/VisitPagination';
import { VisitExportButtons } from '@/components/visits/VisitExportButtons';
import { Card } from '@/components/ui/card';

const VisitList = () => {
  const {
    visits,
    filteredVisits,
    isLoading,
    searchTerm,
    selectedStatus,
    selectedActivityType,
    setSearchTerm,
    setSelectedStatus,
    setSelectedActivityType,
    resetFilters
  } = useVisitData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Daftar Kunjungan</h1>
        <VisitExportButtons />
      </div>

      <Card>
        <VisitFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          selectedActivityType={selectedActivityType}
          setSearchTerm={setSearchTerm}
          setSelectedStatus={setSelectedStatus}
          setSelectedActivityType={setSelectedActivityType}
          resetFilters={resetFilters}
        />
        
        <VisitTable 
          visits={visits} 
          filteredVisits={filteredVisits} 
          isLoading={isLoading} 
        />
        
        <VisitPagination 
          filteredVisits={filteredVisits} 
          totalVisits={visits.length} 
        />
      </Card>
    </div>
  );
};

export default VisitList;
