
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
      
      // Calculate costs for each participant type in this package
      const adultCost = participants.adults * packageData.price_per_adult;
      const childrenCost = participants.children * packageData.price_per_child;
      const teacherCost = participants.teachers * packageData.price_per_teacher;
      
      // Add to totals
      totalAdultCost += adultCost;
      totalChildrenCost += childrenCost;
      totalTeacherCost += teacherCost;
      totalFreeTeachersCount += participants.free_teachers || 0; // Added fallback for undefined
      
      return {
        packageId,
        packageName: packageData.name,
        adults: participants.adults,
        adultCost,
        children: participants.children,
        childrenCost,
        teachers: participants.teachers,
        teacherCost,
        free_teachers: participants.free_teachers || 0, // Added fallback for undefined
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
  
  return Object.entries(accommodationCounts).reduce((sum, [id, count]) => {
    const accommodation = accommodations.find(a => a.id === id);
    return sum + (accommodation ? accommodation.price_per_night * count * nightsCount : 0);
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
  
  return Object.entries(extraBedCounts).reduce((sum, [_, count]) => {
    return sum + (count * EXTRA_BED_PRICE * nightsCount);
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
    return sum + (venue ? venue.price : 0);
  }, 0);
};
