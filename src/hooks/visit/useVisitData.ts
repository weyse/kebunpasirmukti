
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Visit } from '@/types/visit';
import { useVisitFilters } from './useVisitFilters';
import { useVisitSorting } from './useVisitSorting';
import { useVisitPagination } from './useVisitPagination';
import { processVisitData } from './visitDataUtils';

export const useVisitData = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);
  
  const { 
    searchTerm, 
    selectedStatus, 
    selectedActivityType, 
    setSearchTerm, 
    setSelectedStatus, 
    setSelectedActivityType, 
    resetFilters 
  } = useVisitFilters();

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guest_registrations')
        .select('*')
        .order('visit_date', { ascending: false });

      if (error) {
        throw error;
      }

      // Process the data to ensure proper typing
      const processedVisits = processVisitData(data);
      setVisits(processedVisits);
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter visits based on search term and filters
  const filteredVisits = useMemo(() => {
    return visits.filter(visit => {
      const matchesSearch = searchTerm === '' ||
        visit.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.responsible_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.order_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || visit.payment_status === selectedStatus;
      
      const matchesActivity = selectedActivityType === '' || visit.visit_type === selectedActivityType;
      
      return matchesSearch && matchesStatus && matchesActivity;
    });
  }, [visits, searchTerm, selectedStatus, selectedActivityType]);

  // Add sorting functionality
  const { sortField, sortDirection, sortedVisits, handleSort } = useVisitSorting(filteredVisits);

  // Calculate pagination
  const { 
    currentPage, 
    totalPages, 
    paginatedItems: paginatedVisits, 
    nextPage, 
    prevPage, 
    paginate 
  } = useVisitPagination(sortedVisits);

  const handleDeleteVisit = async () => {
    if (!visitToDelete) return;
    
    try {
      const { error } = await supabase
        .from('guest_registrations')
        .delete()
        .eq('id', visitToDelete.id);

      if (error) throw error;
      
      setVisits(visits.filter(visit => visit.id !== visitToDelete.id));
      setVisitToDelete(null);
    } catch (error) {
      console.error("Error deleting visit:", error);
    }
  };

  return {
    visits: paginatedVisits,
    filteredVisits: sortedVisits,
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
  };
};
