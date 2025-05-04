import { PackageParticipantCost } from './types';
import { EXTRA_BED_PRICE } from './constants';
import { PackageParticipants } from '../useSelectionState';

// Calculate package costs
export const calculatePackageCosts = (
  selectedPackages: string[], 
  packageParticipants: PackageParticipants,
  packages: any[]
) => {
  let totalAdultCost = 0;
  let totalChildrenCost = 0;
  let totalTeacherCost = 0;
  let totalFreeTeachersCount = 0;
  
  if (!selectedPackages || !packageParticipants || !packages || selectedPackages.length === 0) {
    return {
      totalAdultCost: 0,
      totalChildrenCost: 0,
      totalTeacherCost: 0,
      totalFreeTeachersCount: 0,
      packageBreakdown: []
    };
  }
  
  const packageBreakdown = selectedPackages
    .map(packageId => {
      const packageData = packages.find(pkg => pkg.id === packageId);
      if (!packageData || !packageParticipants[packageId]) return null;
      
      const participants = packageParticipants[packageId];
      
      // Ensure all values are valid numbers with fallbacks to 0
      const adults = Number(participants?.adults) || 0;
      const children = Number(participants?.children) || 0;
      const teachers = Number(participants?.teachers) || 0;
      const free_teachers = Number(participants?.free_teachers) || 0;
      
      // Override prices except for Lansia 60+
      let pricePerAdult = Number(packageData?.price_per_adult) || 0;
      let pricePerTeacher = Number(packageData?.price_per_teacher) || 0;
      const pricePerChild = Number(packageData?.price_per_child) || 0;
      // Check for Lansia 60+ (by name or type)
      const isLansia = (packageData?.name && packageData.name.toLowerCase().includes('lansia')) || (packageData?.type && packageData.type === 'lansia');
      if (!isLansia) {
        pricePerAdult = 100000;
        pricePerTeacher = 50000;
      }
      
      // Calculate costs for each participant type in this package
      const adultCost = adults * pricePerAdult;
      const childrenCost = children * pricePerChild;
      const teacherCost = teachers * pricePerTeacher;
      
      // Add to totals
      totalAdultCost += adultCost;
      totalChildrenCost += childrenCost;
      totalTeacherCost += teacherCost;
      totalFreeTeachersCount += free_teachers;
      
      return {
        packageId,
        packageName: packageData.name || `Package ${packageId.substring(0, 8)}`,
        adults,
        adultCost,
        children,
        childrenCost,
        teachers,
        teacherCost,
        free_teachers,
        total: adultCost + childrenCost + teacherCost
      };
    })
    .filter(Boolean) as PackageParticipantCost[];
    
  return {
    totalAdultCost,
    totalChildrenCost,
    totalTeacherCost,
    totalFreeTeachersCount,
    packageBreakdown
  };
};

// Calculate accommodation costs
export const calculateAccommodationCost = (
  accommodationCounts: Record<string, number> | undefined,
  accommodations: any[] | undefined,
  nightsCount: number
) => {
  if (!accommodationCounts || !accommodations || Object.keys(accommodationCounts).length === 0) {
    return 0;
  }
  
  // Ensure nights count is a valid number
  const validNightsCount = Number(nightsCount) || 1;
  
  return Object.entries(accommodationCounts).reduce((sum, [id, count]) => {
    const accommodation = accommodations.find(a => a.id === id);
    const validCount = Number(count) || 0;
    const pricePerNight = accommodation ? Number(accommodation.price_per_night) || 0 : 0;
    return sum + (pricePerNight * validCount * validNightsCount);
  }, 0);
};

// Calculate extra bed cost
export const calculateExtraBedCost = (
  extraBedCounts: Record<string, number> | undefined,
  nightsCount: number
) => {
  if (!extraBedCounts || Object.keys(extraBedCounts).length === 0) {
    return 0;
  }
  
  // Ensure nights count is a valid number
  const validNightsCount = Number(nightsCount) || 1;
  
  return Object.entries(extraBedCounts).reduce((sum, [_, count]) => {
    const validCount = Number(count) || 0;
    return sum + (validCount * EXTRA_BED_PRICE * validNightsCount);
  }, 0);
};

// Calculate venue cost
export const calculateVenueCost = (
  selectedVenues: string[] | undefined,
  venues: any[] | undefined
) => {
  if (!selectedVenues || !venues || selectedVenues.length === 0) {
    return 0;
  }
  
  return selectedVenues.reduce((sum, venueId) => {
    const venue = venues.find(v => v.id === venueId);
    const venuePrice = venue ? Number(venue.price) || 0 : 0;
    return sum + venuePrice;
  }, 0);
};
