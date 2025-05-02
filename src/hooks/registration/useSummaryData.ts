
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './useGuestRegistrationForm';
import { SummaryData } from './summary/types';
import { 
  prepareBasicInfo, 
  preparePaymentInfo, 
  prepareRoomsInfo, 
  prepareVenuesInfo, 
  calculateTotalExtraBedCost 
} from './summary/summaryUtils';

// Re-export types for external use
export type { SummaryData } from './summary/types';

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
  const getSummaryData = (): SummaryData => {
    const values = form.getValues();
    
    // Calculate extra bed cost for summary (accounting for nights count)
    const totalExtraBedCost = calculateTotalExtraBedCost(extraBedCounts, nightsCount);
    
    // Prepare all the data sections
    const basicInfo = prepareBasicInfo(values, extraBedCounts, nightsCount, totalExtraBedCost);
    const paymentInfo = preparePaymentInfo(values);
    const roomsInfo = prepareRoomsInfo(accommodationCounts, accommodations, nightsCount);
    const venuesInfo = prepareVenuesInfo(selectedVenues, venues);
    
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
