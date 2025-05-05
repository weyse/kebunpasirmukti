import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAccommodations = (checkinDate, checkoutDate) => {
  const [accommodations, setAccommodations] = useState<any[]>([]);

  useEffect(() => {
    if (checkinDate && checkoutDate) {
      fetchAccommodations();
    }
  }, [checkinDate, checkoutDate]);

  const fetchAccommodations = async () => {
    // Use the available_rooms function to get only available rooms for the date range
    const { data: rooms, error } = await supabase.rpc('available_rooms', {
      new_checkin: checkinDate,
      new_checkout: checkoutDate
    });

    if (error) {
      toast({
        title: "Error fetching accommodations",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (rooms) {
      setAccommodations(
        rooms.map(room => ({
          id: room.id,
          name: room.room_name,
          price: room.price_per_night,
          details: `Capacity: ${room.capacity || ''} people`,
          capacity: room.capacity,
          features: [room.room_type],
          status: room.status,
        }))
      );
    }
  };

  return { accommodations };
};
