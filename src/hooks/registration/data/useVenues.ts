
import { useState, useEffect } from 'react';

export const useVenues = () => {
  const [venues, setVenues] = useState<any[]>([]);
  
  useEffect(() => {
    // Since the venues table doesn't exist in the database yet,
    // we'll use mock data directly without trying to fetch from Supabase
    const mockVenues = [
      {
        id: 'saung_gardena',
        name: 'Saung Gardena',
        capacity: 1,
        price: 2660000,
        features: ['Toilet (WC)', 'Halaman Luas', 'Podium 2.2 m', 'Meja 2', 'Kursi kayu']
      },
      {
        id: 'saung_cempaka',
        name: 'Saung Cempaka',
        capacity: 1,
        price: 6000000,
        features: ['Mushollah', 'Toilet (WC)', 'Podium 2.5 m', 'Meja 2', 'Kursi 100']
      },
      {
        id: 'saung_tribun',
        name: 'Saung Tribun 1 (S. Padi & Panggung)',
        capacity: 1,
        price: 6650000,
        features: ['Toilet (WC)', 'Panggung', 'Mushollah', 'Halaman luas', 'Meja 2']
      },
      {
        id: 'saung_kecapi',
        name: 'Saung Kecapi (Inc. Lapangan Futsal)',
        capacity: 1,
        price: 1995000,
        features: ['Toilet (WC)', 'Mushollah', 'Podium 2.2 m', 'Meja 2']
      },
      {
        id: 'saung_bugenvil',
        name: 'Saung Bugenvil',
        capacity: 1,
        price: 5320000,
        features: ['Toilet (WC)', 'Kursi 100', 'Podium 2x2 m', 'Halaman Luas', 'Meja 2', 'Listrik 2000 watt', 'Terpal 12x6 m (1 buah)', 'Kebersihan']
      },
      {
        id: 'saung_soka',
        name: 'Saung Soka',
        capacity: 1,
        price: 4655000,
        features: ['Toilet (WC)', 'Halaman Luas', 'Podium 2x2 m', 'Meja 2', 'Kursi 50', 'Listrik 2000 watt', 'Terpal 12x6 m (1 buah)', 'Kebersihan']
      },
      {
        id: 'lahan_pelangi',
        name: 'Lahan Pelangi',
        capacity: 1,
        price: 10000000,
        features: ['Toilet (WC)', 'Halaman Luas', 'Kebersihan']
      },
      {
        id: 'saung_kampung_pelangi',
        name: 'Saung Kampung Pelangi',
        capacity: 1,
        price: 1500000,
        features: ['Toilet (WC)', 'Meja 1', 'Kebersihan']
      },
      {
        id: 'lahan_cam_bull',
        name: 'Lahan Cam Bull',
        capacity: 1,
        price: 1500000,
        features: ['Halaman luas', 'Terpal 10x5 m (1 buah)', 'Kebersihan']
      },
      {
        id: 'wale_tonaas',
        name: 'Wale Tonaas',
        capacity: 1,
        price: 3500000,
        features: ['Fasilitas indoor', 'AC', 'Podium', 'Listrik 2000 watt', 'Toilet (WC)', 'Meja 1', 'Kebersihan']
      },
      {
        id: 'wale_wangko',
        name: 'Wale Wangko',
        capacity: 1,
        price: 10000000,
        features: ['Fasilitas indoor', 'AC', 'Podium', 'Listrik 2000 watt', 'Toilet (WC)', 'Meja 1', 'Kebersihan']
      },
      {
        id: 'wale_wallian',
        name: 'Wale Wallian',
        capacity: 1,
        price: 3500000,
        features: ['Fasilitas indoor', 'AC', 'podium', 'Listrik 2000 watt', 'Toilet (WC)', 'Meja 1', 'Kebersihan']
      }
    ];
    
    setVenues(mockVenues);
  }, []);
  
  return { venues };
};
