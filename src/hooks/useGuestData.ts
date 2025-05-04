import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define guest data types
export type PaymentStatus = 'belum_lunas' | 'lunas';

export type Guest = {
  id: string;
  order_id: string;
  responsible_person: string;
  institution_name: string;
  phone_number: string;
  total_visitors: number;
  visit_type: string;
  package_type: string;
  visit_date: string;
  payment_status: PaymentStatus;
  created_at: string;
  adult_count?: number;
  children_count?: number;
  teacher_count?: number;
  total_cost?: number;
  discount_percentage?: number;
  discounted_cost?: number;
  down_payment?: number;
  rooms_json?: string;
  venues_json?: string;
  nights_count?: number;
  extra_bed_counts?: string;
};

export const useGuestData = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [sortField, setSortField] = useState<string>('visit_date');
  const [sortDirection, setSortDirection] = useState<string>('desc');
  
  // Fetch guests data
  useEffect(() => {
    fetchGuestRegistrations();
  }, [sortField, sortDirection]);

  // Function to fetch guest registrations from Supabase
  const fetchGuestRegistrations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guest_registrations')
        .select('*, adult_count, children_count, teacher_count, rooms_json, venues_json, nights_count')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Process the data to match our Guest type
        const processedGuests = data.map(guest => ({
          id: guest.id,
          order_id: guest.order_id || '',
          responsible_person: guest.responsible_person,
          institution_name: guest.institution_name,
          phone_number: guest.phone_number,
          total_visitors: (guest.adult_count || 0) + (guest.children_count || 0) + (guest.teacher_count || 0),
          visit_type: guest.visit_type,
          package_type: guest.package_type,
          visit_date: guest.visit_date,
          payment_status: guest.payment_status,
          created_at: guest.created_at,
          adult_count: guest.adult_count,
          children_count: guest.children_count,
          teacher_count: guest.teacher_count,
          total_cost: guest.total_cost,
          discount_percentage: guest.discount_percentage,
          discounted_cost: guest.discounted_cost,
          down_payment: guest.down_payment,
          rooms_json: typeof guest.rooms_json === 'string' ? JSON.parse(guest.rooms_json) : guest.rooms_json,
          venues_json: typeof guest.venues_json === 'string' ? JSON.parse(guest.venues_json) : guest.venues_json,
          nights_count: guest.nights_count,
        }));
        
        setGuests(processedGuests);
      }
    } catch (error) {
      console.error('Error fetching guest registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load guest registrations data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter guests based on search and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.responsible_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.institution_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? guest.payment_status === selectedStatus : true;
    const matchesActivity = selectedActivityType ? guest.visit_type === selectedActivityType : true;
    
    return matchesSearch && matchesStatus && matchesActivity;
  });

  // Handle sorting
  const handleSort = (field: string) => {
    setIsSorting(true);
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for new field
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle guest deletion
  const handleDeleteGuest = async () => {
    if (guestToDelete) {
      try {
        const { error } = await supabase
          .from('guest_registrations')
          .delete()
          .eq('id', guestToDelete.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setGuests(guests.filter((guest) => guest.id !== guestToDelete.id));
        
        toast({
          title: 'Data tamu berhasil dihapus',
          description: `ID: ${guestToDelete.order_id}`,
        });
        
        setGuestToDelete(null);
      } catch (error) {
        console.error('Error deleting guest:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete guest registration',
          variant: 'destructive',
        });
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus(null);
    setSelectedActivityType(null);
  };

  return {
    guests,
    filteredGuests,
    isLoading,
    isSorting,
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
  };
};
