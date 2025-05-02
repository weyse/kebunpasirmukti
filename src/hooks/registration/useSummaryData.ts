
import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';
import { FormSchema } from './useGuestRegistrationForm';
import { EXTRA_BED_PRICE } from './useCostCalculation';

export const useSummaryData = (
  form: UseFormReturn<FormSchema>,
  extraBedCounts: Record<string, number>,
  totalCost: number,
  discountedCost: number,
  remainingBalance: number,
  nightsCount: number = 1,
  accommodationCounts: Record<string, number> = {},
  selectedVenues: string[] = [],
  accommodations: any[] = [],
  venues: any[] = []
) => {
  // Prepare summary data for the order summary component
  const getSummaryData = () => {
    const values = form.getValues();
    
    // Calculate extra bed cost for summary (accounting for nights count)
    const totalExtraBedCost = Object.values(extraBedCounts).reduce(
      (sum, count) => sum + (count * EXTRA_BED_PRICE * nightsCount), 0
    );
    
    // Calculate total participants
    const totalParticipants = Number(values.adult_count) + 
                             Number(values.children_count) + 
                             Number(values.teacher_count) + 
                             Number(values.free_of_charge_teacher_count);
    
    // Show teachers breakdown if we have free teachers
    const teacherBreakdown = Number(values.free_of_charge_teacher_count) > 0 
      ? `${Number(values.teacher_count)} berbayar, ${Number(values.free_of_charge_teacher_count)} free` 
      : `${Number(values.teacher_count)}`;
    
    const basicInfo = [
      { label: 'PIC', value: values.responsible_person || '-' },
      { label: 'Institusi', value: values.institution_name || '-' },
      { label: 'Tanggal Kunjungan', value: values.visit_date ? format(values.visit_date, 'dd MMM yyyy') : '-' },
      { label: 'Jumlah Peserta', value: `${totalParticipants}` },
      { label: 'Dewasa', value: `${values.adult_count}` },
      { label: 'Anak-anak', value: `${values.children_count}` },
      { label: 'Guru', value: teacherBreakdown }
    ];
    
    // Add nights count if more than 1
    if (nightsCount > 1) {
      basicInfo.push({ 
        label: 'Jumlah Malam', 
        value: `${nightsCount}`
      });
    }
    
    // Add extra bed info if any
    if (totalExtraBedCost > 0) {
      basicInfo.push({ 
        label: 'Extra Bed', 
        value: `${Object.values(extraBedCounts).reduce((sum, count) => sum + count, 0)} (Rp ${totalExtraBedCost.toLocaleString()})` 
      });
    }
    
    // Prepare rooms info
    const roomsInfo = Object.entries(accommodationCounts)
      .filter(([id, count]) => count > 0)
      .map(([id, count]) => {
        const room = accommodations.find(a => a.id === id);
        return {
          name: room ? room.room_type : `Kamar ${id}`,
          count: count,
          price: room ? room.price_per_night * count * nightsCount : undefined
        };
      });

    // Prepare venues info
    const venuesInfo = selectedVenues.map(venueId => {
      const venue = venues.find(v => v.id === venueId);
      return {
        name: venue ? venue.name : `Venue ${venueId}`,
        price: venue ? venue.price : undefined
      };
    });
    
    const paymentInfo = [];
    if (values.bank_name) {
      paymentInfo.push({ label: 'Bank', value: values.bank_name });
    }
    if (values.payment_date) {
      paymentInfo.push({ label: 'Tanggal Pembayaran', value: format(values.payment_date, 'dd MMM yyyy') });
    }
    
    return {
      basicInfo,
      paymentInfo,
      costCalculation: {
        baseTotal: totalCost,
        discountedTotal: discountedCost,
        remaining: remainingBalance
      },
      roomsInfo,
      venuesInfo
    };
  };

  return {
    getSummaryData
  };
};
