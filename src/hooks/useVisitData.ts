
import { useState, useEffect } from 'react';
import { Visit } from '@/types/visit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useVisitData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch visits from Supabase
  useEffect(() => {
    const fetchVisits = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('guest_registrations')
          .select('id, order_id, institution_name, responsible_person, visit_type, visit_date, payment_status, adult_count, children_count, teacher_count')
          .order('visit_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match the Visit type
          const transformedVisits: Visit[] = data.map(item => ({
            id: item.id,
            order_id: item.order_id || 'N/A',
            institution_name: item.institution_name,
            responsible_person: item.responsible_person,
            total_visitors: (item.adult_count || 0) + (item.children_count || 0) + (item.teacher_count || 0),
            visit_type: item.visit_type,
            visit_date: item.visit_date,
            payment_status: item.payment_status
          }));
          
          setVisits(transformedVisits);
        }
      } catch (error) {
        console.error('Error fetching visits:', error);
        toast('Error fetching visits');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVisits();
  }, []);
  
  // Filter visits based on search and filters
  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.responsible_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.institution_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || !selectedStatus ? true : visit.payment_status === selectedStatus;
    const matchesActivity = selectedActivityType === 'all' || !selectedActivityType ? true : visit.visit_type === selectedActivityType;
    
    return matchesSearch && matchesStatus && matchesActivity;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus(null);
    setSelectedActivityType(null);
  };

  return {
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
  };
};
