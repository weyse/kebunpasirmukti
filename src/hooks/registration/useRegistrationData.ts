
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ClassType } from '../types/registrationTypes';

export const useRegistrationData = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  
  useEffect(() => {
    fetchPackages();
    fetchAccommodations();
    fetchVenues();
  }, []);

  const fetchPackages = async () => {
    console.log("Fetching packages...");
    const { data, error } = await supabase
      .from('packages')
      .select('*');

    if (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error fetching packages",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      console.log("Packages fetched:", data);
      setPackages(data);
    }
  };

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
      })));
    }
  };

  const fetchVenues = async () => {
    // Example venues - in a real app this would come from the database
    const mockVenues = [
      {
        id: 'saung_gardena',
        name: 'Saung Gardena',
        capacity: 100,
        price: 2660000,
        features: ['Toilet (WC)', 'Halaman Luas', 'Podium 2.2 m', 'Meja 2', 'Kursi kayu']
      },
      {
        id: 'saung_cempaka',
        name: 'Saung Cempaka',
        capacity: 300,
        price: 6000000,
        features: ['Mushollah', 'Toilet (WC)', 'Podium 2.5 m', 'Meja 2', 'Kursi 100']
      },
      {
        id: 'saung_tribun',
        name: 'Saung Tribun 1 (S. Padi & Panggung)',
        capacity: 300,
        price: 6650000,
        features: ['Toilet (WC)', 'Panggung', 'Mushollah', 'Halaman luas', 'Meja 2']
      },
      {
        id: 'saung_kecapi',
        name: 'Saung Kecapi (Inc. Lapangan Futsal)',
        capacity: 80,
        price: 1995000,
        features: ['Toilet (WC)', 'Mushollah', 'Podium 2.2 m', 'Meja 2']
      },
      {
        id: 'saung_bugenvil',
        name: 'Saung Bugenvil',
        capacity: 250,
        price: 5320000,
        features: ['Toilet (WC)', 'Kursi 100', 'Podium 2x2 m', 'Halaman Luas', 'Meja 2', 'Listrik 2000 watt', 'Terpal 12x6 m (1 buah)', 'Kebersihan']
      },
      {
        id: 'saung_soka',
        name: 'Saung Soka',
        capacity: 150,
        price: 4655000,
        features: ['Toilet (WC)', 'Halaman Luas', 'Podium 2x2 m', 'Meja 2', 'Kursi 50', 'Listrik 2000 watt', 'Terpal 12x6 m (1 buah)', 'Kebersihan']
      },
      {
        id: 'lahan_pelangi',
        name: 'Lahan Pelangi',
        capacity: 4000,
        price: 10000000,
        features: ['Toilet (WC)', 'Halaman Luas', 'Kebersihan']
      },
      {
        id: 'saung_kampung_pelangi',
        name: 'Saung Kampung Pelangi',
        capacity: 50,
        price: 1500000,
        features: ['Toilet (WC)', 'Meja 1', 'Kebersihan']
      },
      {
        id: 'lahan_cam_bull',
        name: 'Lahan Cam Bull',
        capacity: 50,
        price: 1500000,
        features: ['Halaman luas', 'Terpal 10x5 m (1 buah)', 'Kebersihan']
      },
      {
        id: 'wale_tonaas',
        name: 'Wale Tonaas',
        capacity: 100,
        price: 3500000,
        features: ['Fasilitas indoor', 'AC', 'Podium', 'Listrik 2000 watt', 'Toilet (WC)', 'Meja 1', 'Kebersihan']
      },
      {
        id: 'wale_wangko',
        name: 'Wale Wangko',
        capacity: 250,
        price: 10000000,
        features: ['Fasilitas indoor', 'AC', 'Podium', 'Listrik 2000 watt', 'Toilet (WC)', 'Meja 1', 'Kebersihan']
      },
      {
        id: 'wale_wallian',
        name: 'Wale Wallian',
        capacity: 100,
        price: 3500000,
        features: ['Fasilitas indoor', 'AC', 'podium', 'Listrik 2000 watt', 'Toilet (WC)', 'Meja 1', 'Kebersihan']
      }
    ];
    
    setVenues(mockVenues);
  };

  const fetchGuestRegistration = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('guest_registrations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Fetch classes if any
      const { data: classesData } = await supabase
        .from('guest_classes')
        .select('class_type')
        .eq('registration_id', id);
      
      const classes = classesData ? classesData.map(c => c.class_type) as ClassType[] : [];

      return { registrationData: data, classes };
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    packages,
    accommodations,
    venues,
    fetchGuestRegistration,
  };
};
