
import { format } from 'date-fns';
import { FormSchema } from '../useGuestRegistrationForm';
import { EXTRA_BED_PRICE } from '../cost/constants';
import { SummaryItem, RoomVenueItem } from './types';
import { formatCurrency } from '@/utils/formatters';

// Prepare basic info summary items
export const prepareBasicInfo = (
  values: FormSchema, 
  extraBedCounts: Record<string, number>,
  nightsCount: number,
  totalExtraBedCost: number
): SummaryItem[] => {
  // Calculate total participants with null/NaN checks
  const adultCount = Number(values.adult_count) || 0;
  const childrenCount = Number(values.children_count) || 0;
  const teacherCount = Number(values.teacher_count) || 0;
  const freeTeacherCount = Number(values.free_of_charge_teacher_count) || 0;
  
  const totalParticipants = adultCount + childrenCount + teacherCount + freeTeacherCount;
  
  // Show teachers breakdown if we have free teachers
  const teacherBreakdown = freeTeacherCount > 0 
    ? `${teacherCount} berbayar, ${freeTeacherCount} free` 
    : `${teacherCount}`;
  
  const basicInfo = [
    { label: 'PIC', value: values.responsible_person || '-' },
    { label: 'Institusi', value: values.institution_name || '-' },
    { label: 'Tanggal Kunjungan', value: values.visit_date ? format(new Date(values.visit_date), 'dd MMM yyyy') : '-' },
    { label: 'Jumlah Peserta', value: `${totalParticipants}` },
    { label: 'Dewasa', value: `${adultCount}` },
    { label: 'Anak-anak', value: `${childrenCount}` },
    { label: 'Guru', value: teacherBreakdown }
  ];
  
  // Add nights count if more than 1
  const validNightsCount = Number(nightsCount) || 1;
  if (validNightsCount > 1) {
    basicInfo.push({ 
      label: 'Jumlah Malam', 
      value: `${validNightsCount}`
    });
  }
  
  // Add extra bed info if any
  if (totalExtraBedCost > 0) {
    const totalExtraBeds = Object.values(extraBedCounts || {}).reduce((sum, count) => sum + (Number(count) || 0), 0);
    basicInfo.push({ 
      label: 'Extra Bed', 
      value: `${totalExtraBeds} (${formatCurrency(totalExtraBedCost)})` 
    });
  }
  
  return basicInfo;
};

// Prepare payment info summary items
export const preparePaymentInfo = (values: FormSchema): SummaryItem[] => {
  const paymentInfo: SummaryItem[] = [];
  
  if (values.bank_name) {
    paymentInfo.push({ label: 'Bank', value: values.bank_name });
  }
  
  if (values.payment_date) {
    paymentInfo.push({ 
      label: 'Tanggal Pembayaran', 
      value: format(new Date(values.payment_date), 'dd MMM yyyy') 
    });
  }
  
  // Add down payment info if available
  if (values.down_payment) {
    const downPayment = Number(values.down_payment) || 0;
    paymentInfo.push({ 
      label: 'Uang Muka', 
      value: formatCurrency(downPayment)
    });
  }
  
  return paymentInfo;
};

// Prepare rooms info
export const prepareRoomsInfo = (
  accommodationCounts: Record<string, number>,
  accommodations: any[],
  nightsCount: number
): RoomVenueItem[] => {
  // Ensure nights count is a valid number
  const validNightsCount = Number(nightsCount) || 1;
  
  return Object.entries(accommodationCounts || {})
    .filter(([_, count]) => Number(count) > 0)
    .map(([id, count]) => {
      const room = accommodations.find(a => a.id === id);
      const validCount = Number(count) || 0;
      const pricePerNight = room ? Number(room.price_per_night) || 0 : 0;
      const totalPrice = pricePerNight * validCount * validNightsCount;
      
      return {
        name: room ? (room.room_type || `Kamar ${id.substring(0, 8)}`) : `Kamar ${id.substring(0, 8)}`,
        count: validCount,
        price: totalPrice
      };
    });
};

// Prepare venues info
export const prepareVenuesInfo = (
  selectedVenues: string[],
  venues: any[]
): RoomVenueItem[] => {
  return (selectedVenues || []).map(venueId => {
    const venue = venues.find(v => v.id === venueId);
    const venuePrice = venue ? Number(venue.price) || 0 : 0;
    
    return {
      name: venue ? (venue.name || `Venue ${venueId.substring(0, 8)}`) : `Venue ${venueId.substring(0, 8)}`,
      price: venuePrice
    };
  });
};

// Calculate total extra bed cost
export const calculateTotalExtraBedCost = (
  extraBedCounts: Record<string, number>,
  nightsCount: number
): number => {
  // Ensure nights count is a valid number
  const validNightsCount = Number(nightsCount) || 1;
  
  return Object.values(extraBedCounts || {}).reduce(
    (sum, count) => sum + ((Number(count) || 0) * EXTRA_BED_PRICE * validNightsCount), 0
  );
};
