
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
    
    // Ensure all values are valid numbers
    const safeTotalCost = isNaN(totalCost) ? 0 : totalCost;
    const safeDiscountedCost = isNaN(discountedCost) ? 0 : discountedCost;
    const safeRemainingBalance = isNaN(remainingBalance) ? 0 : remainingBalance;
    const safeNightsCount = Number(nightsCount) || 1;
    
    // Calculate extra bed cost for summary (accounting for nights count)
    const totalExtraBedCost = calculateTotalExtraBedCost(extraBedCounts, safeNightsCount);
    
    // Prepare all the data sections
    const basicInfo = prepareBasicInfo(values, extraBedCounts, safeNightsCount, totalExtraBedCost);
    const paymentInfo = preparePaymentInfo(values);
    const roomsInfo = prepareRoomsInfo(accommodationCounts, accommodations, safeNightsCount);
    const venuesInfo = prepareVenuesInfo(selectedVenues, venues);
    
    return {
      basicInfo,
      paymentInfo,
      costCalculation: {
        baseTotal: safeTotalCost,
        discountedTotal: safeDiscountedCost,
        remaining: safeRemainingBalance
      },
      roomsInfo,
      venuesInfo
    };
  };

  return {
    getSummaryData
  };
};
