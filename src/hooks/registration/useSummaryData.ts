
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
  nightsCount: number = 1
) => {
  // Prepare summary data for the order summary component
  const getSummaryData = () => {
    const values = form.getValues();
    
    // Calculate extra bed cost for summary (accounting for nights count)
    const totalExtraBedCost = Object.values(extraBedCounts).reduce(
      (sum, count) => sum + (count * EXTRA_BED_PRICE * nightsCount), 0
    );
    
    const basicInfo = [
      { label: 'PIC', value: values.responsible_person || '-' },
      { label: 'Institusi', value: values.institution_name || '-' },
      { label: 'Tanggal Kunjungan', value: values.visit_date ? format(values.visit_date, 'dd MMM yyyy') : '-' },
      { label: 'Jumlah Peserta', value: `${Number(values.adult_count) + Number(values.children_count) + Number(values.teacher_count)}` }
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
      }
    };
  };

  return {
    getSummaryData
  };
};
