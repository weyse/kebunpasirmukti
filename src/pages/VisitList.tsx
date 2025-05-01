
import React from 'react';
import { useVisitData } from '@/hooks/useVisitData';
import { VisitFilters } from '@/components/visits/VisitFilters';
import { VisitTable } from '@/components/visits/VisitTable';
import { VisitPagination } from '@/components/visits/VisitPagination';
import { VisitExportButtons } from '@/components/visits/VisitExportButtons';
import { DeleteVisitDialog } from '@/components/visits/DeleteVisitDialog';
import { Card } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';

const VisitList = () => {
  const {
    visits,
    filteredVisits,
    isLoading,
    searchTerm,
    selectedStatus,
    selectedActivityType,
    visitToDelete,
    sortField,
    sortDirection,
    currentPage,
    totalPages,
    setSearchTerm,
    setSelectedStatus,
    setSelectedActivityType,
    setVisitToDelete,
    handleSort,
    handleDeleteVisit,
    nextPage,
    prevPage,
    paginate,
    resetFilters
  } = useVisitData();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-3xl font-bold">Daftar Kunjungan</h1>
          <VisitExportButtons filteredVisits={filteredVisits} />
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
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            setVisitToDelete={setVisitToDelete}
          />
          
          <VisitPagination 
            filteredVisits={filteredVisits} 
            totalVisits={visits.length}
            currentPage={currentPage}
            totalPages={totalPages}
            nextPage={nextPage}
            prevPage={prevPage}
            paginate={paginate}
          />
        </Card>

        <DeleteVisitDialog 
          visitToDelete={visitToDelete}
          setVisitToDelete={setVisitToDelete}
          handleDeleteVisit={handleDeleteVisit}
        />
      </div>
    </TooltipProvider>
  );
};

export default VisitList;
