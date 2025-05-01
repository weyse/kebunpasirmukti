
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './useGuestRegistrationForm';

// Extra bed price constant
export const EXTRA_BED_PRICE = 160000;

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
    
    // Calculate participants cost
    const participantsCost = (adultCount * adultPrice) + (childrenCount * childrenPrice) + (teacherCount * teacherPrice);
    
    // Calculate total cost including extra beds
    const total = participantsCost + accommodationCost + extraBedCost + venueCost;
    setTotalCost(total);
    
    // Apply discount
    const discountPercentage = Number(form.getValues("discount_percentage")) || 0;
    const discountAmount = (discountPercentage / 100) * total;
    const withDiscount = total - discountAmount;
    setDiscountedCost(withDiscount);
    
    // Calculate remaining balance
    const downPayment = Number(form.getValues("down_payment")) || 0;
    setRemainingBalance(withDiscount - downPayment);
  };

  return {
    totalCost,
    discountedCost,
    remainingBalance,
  };
};
