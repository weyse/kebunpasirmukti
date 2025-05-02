
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Visit, RoomsJsonData, VenuesJsonData } from '@/types/visit';

// Helper to safely parse JSON data
const safeParseJson = (jsonData: any, defaultValue: any) => {
  if (!jsonData) return defaultValue;
  
  if (typeof jsonData === 'string') {
    try {
      return JSON.parse(jsonData);
    } catch (err) {
      console.error('Error parsing JSON data:', err);
      return defaultValue;
    }
  }
  
  if (typeof jsonData === 'object') {
    return jsonData;
  }
  
  return defaultValue;
};

export const useVisitData = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState('');
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null);
  const [sortField, setSortField] = useState('visit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      const processedVisits: Visit[] = data.map(visit => {
        // Calculate the total visitors
        const totalVisitors = (
          Number(visit.adult_count || 0) + 
          Number(visit.children_count || 0) + 
          Number(visit.teacher_count || 0) +
          Number(visit.free_of_charge_teacher_count || 0)
        );
        
        // Create a properly typed Visit object
        const typedVisit: Visit = {
          ...visit,
          id: visit.id,
          order_id: visit.order_id || '',
          institution_name: visit.institution_name || '',
          responsible_person: visit.responsible_person || '',
          visit_type: visit.visit_type || 'wisata_edukasi',
          visit_date: visit.visit_date || '',
          payment_status: visit.payment_status || 'belum_lunas',
          total_visitors: totalVisitors
        };

        // Add optional properties if they exist
        if (visit.total_cost !== undefined) typedVisit.total_cost = visit.total_cost;
        if (visit.discount_percentage !== undefined) typedVisit.discount_percentage = visit.discount_percentage;
        if (visit.discounted_cost !== undefined) typedVisit.discounted_cost = visit.discounted_cost;
        if (visit.down_payment !== undefined) typedVisit.down_payment = visit.down_payment;
        if (visit.adult_count !== undefined) typedVisit.adult_count = visit.adult_count;
        if (visit.children_count !== undefined) typedVisit.children_count = visit.children_count;
        if (visit.teacher_count !== undefined) typedVisit.teacher_count = visit.teacher_count;
        if (visit.nights_count !== undefined) typedVisit.nights_count = visit.nights_count;

        // Parse JSON fields
        typedVisit.rooms_json = safeParseJson(visit.rooms_json, { 
          accommodation_counts: {},
          extra_bed_counts: {} 
        }) as RoomsJsonData;
        
        typedVisit.venues_json = safeParseJson(visit.venues_json, { 
          selected_venues: [] 
        }) as VenuesJsonData;

        return typedVisit;
      });

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
  const sortedVisits = useMemo(() => {
    return [...filteredVisits].sort((a, b) => {
      let valueA = a[sortField as keyof Visit] || '';
      let valueB = b[sortField as keyof Visit] || '';
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sortDirection === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
      }
    });
  }, [filteredVisits, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedVisits.length / itemsPerPage);
  const paginatedVisits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedVisits.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedVisits, currentPage]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedActivityType('');
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
