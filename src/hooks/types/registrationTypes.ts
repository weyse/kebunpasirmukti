
// Define types to match database enum
export type VisitType = 'wisata_edukasi' | 'outbound' | 'camping' | 'field_trip' | 'penelitian' | 'lainnya';
export type PaymentStatus = 'belum_lunas' | 'lunas';
export type ClassType = 'kb_tk' | 'sd_1_2' | 'sd_3_4' | 'sd_5_6' | 'smp' | 'sma' | 'umum_a' | 'umum_b' | 'abk';

// Class options constant
export const classOptions = [
  { id: 'kb_tk', label: 'KB/TK' },
  { id: 'sd_1_2', label: 'SD Kelas 1 & 2' },
  { id: 'sd_3_4', label: 'SD Kelas 3 & 4' },
  { id: 'sd_5_6', label: 'SD Kelas 5 & 6' },
  { id: 'smp', label: 'SMP' },
  { id: 'sma', label: 'SMA' },
  { id: 'umum_a', label: 'Umum A' },
  { id: 'umum_b', label: 'Umum B' },
  { id: 'abk', label: 'ABK' }
];
