
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './useGuestRegistrationForm';
import { PackageParticipants } from './useSelectionState';

// Extra bed price constant
export const EXTRA_BED_PRICE = 160000;

export interface CostCalculationSummary {
  adultCost: number;
  childrenCost: number;
  childrenDiscountAmount: number;
  teacherCost: number;
  accommodationCost: number;
  extraBedCost: number;
  venueCost: number;
  subtotal: number;
  finalTotal: number;
  freeTeachersCount: number;
  packageBreakdown: {
    packageId: string;
    packageName: string;
    adults: number;
    adultCost: number;
    children: number;
    childrenCost: number;
    teachers: number;
    teacherCost: number;
    free_teachers: number;
    total: number;
  }[];
}

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
    // Calculate costs based on package participants allocation
    let totalAdultCost = 0;
    let totalChildrenCost = 0;
    let totalTeacherCost = 0;
    let totalFreeTeachersCount = 0;
    
    const packageBreakdown = selectedPackages.map(packageId => {
      const packageData = packages.find(pkg => pkg.id === packageId);
      if (!packageData || !packageParticipants[packageId]) return null;
      
      const participants = packageParticipants[packageId];
      
      // Calculate costs for each participant type in this package
      const adultCost = participants.adults * packageData.price_per_adult;
      const childrenCost = participants.children * packageData.price_per_child;
      const teacherCost = participants.teachers * packageData.price_per_teacher;
      // Free teachers don't contribute to cost
      totalFreeTeachersCount += participants.free_teachers;
      
      // Add to totals
      totalAdultCost += adultCost;
      totalChildrenCost += childrenCost;
      totalTeacherCost += teacherCost;
      
      return {
        packageId,
        packageName: packageData.name,
        adults: participants.adults,
        adultCost,
        children: participants.children,
        childrenCost,
        teachers: participants.teachers,
        teacherCost,
        free_teachers: participants.free_teachers,
        total: adultCost + childrenCost + teacherCost // Free teachers don't add to total
      };
    }).filter(Boolean);
    
    // Apply discount ONLY to children's cost
    const discountPercentage = Number(form.getValues("discount_percentage")) || 0;
    const childrenDiscountAmount = (discountPercentage / 100) * totalChildrenCost;
    const discountedChildrenCost = totalChildrenCost - childrenDiscountAmount;
    
    // Calculate accommodations cost (accounting for nights count)
    const accommodationCost = Object.entries(accommodationCounts).reduce((sum, [id, count]) => {
      const accommodation = accommodations.find(a => a.id === id);
      return sum + (accommodation ? accommodation.price * count * nightsCount : 0);
    }, 0);
    
    // Calculate extra bed cost (accounting for nights count)
    const extraBedCost = Object.entries(extraBedCounts).reduce((sum, [id, count]) => {
      return sum + (count * EXTRA_BED_PRICE * nightsCount);
    }, 0);
    
    // Calculate venue cost
    const venueCost = selectedVenues.reduce((sum, venueId) => {
      const venue = venues.find(v => v.id === venueId);
      return sum + (venue ? venue.price : 0);
    }, 0);
    
    // Calculate total cost with discount applied only to children
    const subtotal = totalAdultCost + totalChildrenCost + totalTeacherCost + accommodationCost + extraBedCost + venueCost;
    const total = totalAdultCost + discountedChildrenCost + totalTeacherCost + accommodationCost + extraBedCost + venueCost;
    
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
      packageBreakdown: packageBreakdown as any[]
    });
  };

  return {
    totalCost,
    discountedCost,
    remainingBalance,
    calculationSummary
  };
};
