
// Define class type options
export type ClassType = 'kb_tk' | 'sd_1_2' | 'sd_3_4' | 'sd_5_6' | 'smp' | 'sma' | 'university' | 'umum';

export const classOptions: Array<{ id: ClassType; label: string }> = [
  { id: 'kb_tk', label: 'KB / TK / PAUD' },
  { id: 'sd_1_2', label: 'SD Kelas 1-2' },
  { id: 'sd_3_4', label: 'SD Kelas 3-4' },
  { id: 'sd_5_6', label: 'SD Kelas 5-6' },
  { id: 'smp', label: 'SMP' },
  { id: 'sma', label: 'SMA' },
  { id: 'university', label: 'Universitas' },
  { id: 'umum', label: 'Umum' },
];
