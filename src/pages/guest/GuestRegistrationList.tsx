
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGuestData } from '@/hooks/useGuestData';
import { GuestFilters } from '@/components/guest/GuestFilters';
import { GuestTable } from '@/components/guest/GuestTable';
import { GuestPagination } from '@/components/guest/GuestPagination';
import { DeleteGuestDialog } from '@/components/guest/DeleteGuestDialog';
import { TooltipProvider } from '@/components/ui/tooltip';

const GuestRegistrationList = () => {
  const navigate = useNavigate();
  const {
    guests,
    filteredGuests,
    isLoading,
    searchTerm,
    selectedStatus,
    selectedActivityType,
    guestToDelete,
    sortField,
    sortDirection,
    setSearchTerm,
    setSelectedStatus,
    setSelectedActivityType,
    setGuestToDelete,
    handleSort,
    handleDeleteGuest,
    resetFilters
  } = useGuestData();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-3xl font-bold">Registrasi Tamu</h1>
          <Button 
            className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
            onClick={() => navigate('/guest-registration/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrasi Baru
          </Button>
        </div>

        <Card>
          <GuestFilters
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            selectedActivityType={selectedActivityType}
            setSearchTerm={setSearchTerm}
            setSelectedStatus={setSelectedStatus}
            setSelectedActivityType={setSelectedActivityType}
            resetFilters={resetFilters}
          />

          <GuestTable
            guests={guests}
            filteredGuests={filteredGuests}
            isLoading={isLoading}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            setGuestToDelete={setGuestToDelete}
          />
          
          <GuestPagination
            filteredGuests={filteredGuests}
            totalGuests={guests.length}
          />
        </Card>

        <DeleteGuestDialog
          guestToDelete={guestToDelete}
          setGuestToDelete={setGuestToDelete}
          handleDeleteGuest={handleDeleteGuest}
        />
      </div>
    </TooltipProvider>
  );
};

export default GuestRegistrationList;
