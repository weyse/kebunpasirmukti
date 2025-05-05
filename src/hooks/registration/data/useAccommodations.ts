import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAccommodations = () => {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  
  useEffect(() => {
    fetchAccommodations();
  }, []);
  
  const fetchAccommodations = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');

    if (error) {
      toast({
        title: "Error fetching accommodations",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setAccommodations(data.map(room => ({
        id: room.id,
        name: room.room_name,
        price: room.price_per_night,
        details: `Capacity: ${room.capacity} people`,
        capacity: room.capacity,
        features: [room.room_type],
        status: room.status,
      })));
    }
  };
  
  return { accommodations };
};
