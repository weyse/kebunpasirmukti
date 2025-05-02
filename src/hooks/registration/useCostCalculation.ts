
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './useGuestRegistrationForm';
import { PackageParticipants } from './useSelectionState';
import { CostCalculationSummary } from './cost/types';
import { EXTRA_BED_PRICE } from './cost/constants';
import { 
  calculatePackageCosts,
  calculateAccommodationCost,
  calculateExtraBedCost, 
  calculateVenueCost 
} from './cost/costCalculationUtils';

// Re-export the constants and types
export { EXTRA_BED_PRICE } from './cost/constants';
export type { CostCalculationSummary } from './cost/types';

export const useCostCalculation = (
  form: UseFormReturn<FormSchema>,
  selectedPackages: string[],
  packageParticipants: PackageParticipants,
  accommodationCounts: Record<string, number>,
  extraBedCounts: Record<string, number>,
  selectedVenues: string[],
  packages: any[],
  accommodations: any[],
  venues: any[],
  nightsCount: number = 1
) => {
  const [totalCost, setTotalCost] = useState(0);
  const [discountedCost, setDiscountedCost] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [calculationSummary, setCalculationSummary] = useState<CostCalculationSummary>({
    adultCost: 0,
    childrenCost: 0,
    childrenDiscountAmount: 0,
    teacherCost: 0,
    accommodationCost: 0,
    extraBedCost: 0,
    venueCost: 0,
    subtotal: 0,
    finalTotal: 0,
    freeTeachersCount: 0,
    packageBreakdown: []
  });

  // Watch form values for cost calculation
  const watchDiscount = form.watch("discount_percentage");
  const watchDownPayment = form.watch("down_payment");

  useEffect(() => {
    calculateCosts();
  }, [
    watchDiscount,
    watchDownPayment,
    selectedPackages,
    packageParticipants,
    accommodationCounts,
    extraBedCounts,
    selectedVenues,
    packages,
    venues,
    nightsCount
  ]);

  const calculateCosts = () => {
    // Make sure we have all required data
    if (!packages || packages.length === 0) {
      console.warn("No packages available for cost calculation");
      return;
    }
    
    // Calculate package costs using utility functions
    const { 
      totalAdultCost,
      totalChildrenCost, 
      totalTeacherCost,
      totalFreeTeachersCount,
      packageBreakdown
    } = calculatePackageCosts(
      selectedPackages || [], 
      packageParticipants || {}, 
      packages
    );
    
    // Apply discount ONLY to children's cost
    const discountPercentage = Number(form.getValues("discount_percentage")) || 0;
    const childrenDiscountAmount = (discountPercentage / 100) * totalChildrenCost;
    const discountedChildrenCost = totalChildrenCost - childrenDiscountAmount;
    
    // Calculate accommodations cost (accounting for nights count)
    const accommodationCost = calculateAccommodationCost(
      accommodationCounts || {}, 
      accommodations || [], 
      nightsCount || 1
    );
    
    // Calculate extra bed cost (accounting for nights count)
    const extraBedCost = calculateExtraBedCost(
      extraBedCounts || {}, 
      nightsCount || 1
    );
    
    // Calculate venue cost
    const venueCost = calculateVenueCost(
      selectedVenues || [], 
      venues || []
    );
    
    // Calculate total cost with discount applied only to children
    const subtotal = totalAdultCost + totalChildrenCost + totalTeacherCost + 
                     accommodationCost + extraBedCost + venueCost;
    
    const total = totalAdultCost + discountedChildrenCost + totalTeacherCost + 
                  accommodationCost + extraBedCost + venueCost;
    
    console.log('Cost calculation:', {
      totalAdultCost,
      totalChildrenCost,
      discountedChildrenCost,
      totalTeacherCost,
      accommodationCost,
      extraBedCost,
      venueCost,
      subtotal,
      total
    });
    
    setTotalCost(subtotal);
    setDiscountedCost(total);
    
    // Calculate remaining balance
    const downPayment = Number(form.getValues("down_payment")) || 0;
    setRemainingBalance(total - downPayment);
    
    // Update calculation summary
    setCalculationSummary({
      adultCost: totalAdultCost,
      childrenCost: totalChildrenCost,
      childrenDiscountAmount,
      teacherCost: totalTeacherCost,
      accommodationCost,
      extraBedCost,
      venueCost,
      subtotal,
      finalTotal: total,
      freeTeachersCount: totalFreeTeachersCount,
      packageBreakdown
    });
  };

  return {
    totalCost,
    discountedCost,
    remainingBalance,
    calculationSummary
  };
};
