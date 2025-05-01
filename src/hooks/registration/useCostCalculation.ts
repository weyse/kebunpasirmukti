
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './useGuestRegistrationForm';

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
}

export const useCostCalculation = (
  form: UseFormReturn<FormSchema>,
  selectedPackage: string,
  accommodationCounts: Record<string, number>,
  extraBedCounts: Record<string, number>,
  selectedVenues: string[],
  packages: any[],
  accommodations: any[],
  venues: any[]
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
    finalTotal: 0
  });

  // Watch form values for cost calculation
  const watchDiscount = form.watch("discount_percentage");
  const watchDownPayment = form.watch("down_payment");
  const watchAdultCount = form.watch("adult_count");
  const watchChildrenCount = form.watch("children_count");
  const watchTeacherCount = form.watch("teacher_count");

  useEffect(() => {
    calculateCosts();
  }, [
    watchAdultCount,
    watchChildrenCount, 
    watchTeacherCount,
    watchDiscount,
    watchDownPayment,
    selectedPackage,
    accommodationCounts,
    extraBedCounts,
    selectedVenues,
    packages,
    venues
  ]);

  const calculateCosts = () => {
    // Calculate participant costs based on selected package
    const adultCount = Number(form.getValues("adult_count")) || 0;
    const childrenCount = Number(form.getValues("children_count")) || 0;
    const teacherCount = Number(form.getValues("teacher_count")) || 0;
    
    // Find the selected package and get its price
    const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage);
    
    // Base price per person
    const adultPrice = selectedPackageData?.price_per_adult || 100000;
    const childrenPrice = selectedPackageData?.price_per_child || 80000; 
    const teacherPrice = selectedPackageData?.price_per_teacher || 50000;  
    
    // Calculate costs for each participant type
    const adultCost = adultCount * adultPrice;
    const regularChildrenCost = childrenCount * childrenPrice;
    const teacherCost = teacherCount * teacherPrice;
    
    // Apply discount ONLY to children's cost
    const discountPercentage = Number(form.getValues("discount_percentage")) || 0;
    const childrenDiscountAmount = (discountPercentage / 100) * regularChildrenCost;
    const discountedChildrenCost = regularChildrenCost - childrenDiscountAmount;
    
    // Calculate accommodations cost
    const accommodationCost = Object.entries(accommodationCounts).reduce((sum, [id, count]) => {
      const accommodation = accommodations.find(a => a.id === id);
      return sum + (accommodation ? accommodation.price * count : 0);
    }, 0);
    
    // Calculate extra bed cost
    const extraBedCost = Object.entries(extraBedCounts).reduce((sum, [id, count]) => {
      return sum + (count * EXTRA_BED_PRICE);
    }, 0);
    
    // Calculate venue cost
    const venueCost = selectedVenues.reduce((sum, venueId) => {
      const venue = venues.find(v => v.id === venueId);
      return sum + (venue ? venue.price : 0);
    }, 0);
    
    // Calculate total cost with discount applied only to children
    const subtotal = adultCost + regularChildrenCost + teacherCost + accommodationCost + extraBedCost + venueCost;
    const total = adultCost + discountedChildrenCost + teacherCost + accommodationCost + extraBedCost + venueCost;
    
    setTotalCost(subtotal);
    setDiscountedCost(total);
    
    // Calculate remaining balance
    const downPayment = Number(form.getValues("down_payment")) || 0;
    setRemainingBalance(total - downPayment);
    
    // Update calculation summary
    setCalculationSummary({
      adultCost,
      childrenCost: regularChildrenCost,
      childrenDiscountAmount,
      teacherCost,
      accommodationCost,
      extraBedCost,
      venueCost,
      subtotal,
      finalTotal: total
    });
  };

  return {
    totalCost,
    discountedCost,
    remainingBalance,
    calculationSummary
  };
};
