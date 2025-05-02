
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestRegistrationForm } from './useGuestRegistrationForm';
import { useRegistrationData } from './useRegistrationData';
import { useCostCalculation } from './useCostCalculation';
import { useRegistrationSubmit } from './useRegistrationSubmit';
import { useSelectionState } from './useSelectionState';
import { useSummaryData } from './useSummaryData';
import { useRegistrationLoader } from './useRegistrationLoader';
import { ClassType, classOptions } from '../types/registrationTypes';

// Re-export for backward compatibility
export { EXTRA_BED_PRICE } from './useCostCalculation';
export { classOptions };
export type { ClassType };
export type { VisitType, PaymentStatus } from './useRegistrationSubmit';
export type { PackageParticipants } from './useSelectionState';

interface UseGuestRegistrationProps {
  editId?: string;
  nightsCount?: number;
}

export const useGuestRegistration = ({ editId, nightsCount = 1 }: UseGuestRegistrationProps = {}) => {
  // Custom hooks
  const form = useGuestRegistrationForm();
  const { packages, accommodations, venues } = useRegistrationData();
  const [localNightsCount, setLocalNightsCount] = useState(nightsCount);
  
  const {
    selectedClasses,
    selectedPackages,
    packageParticipants,
    accommodationCounts,
    extraBedCounts,
    selectedVenues,
    initializeAccommodationCounts,
    handleClassChange,
    handlePackageChange,
    handlePackageParticipantsChange,
    handleAccommodationChange,
    handleExtraBedChange,
    handleVenueChange,
    setPackageParticipants,
    setSelectedPackages,
    setAccommodationCounts,
    setExtraBedCounts,
    setSelectedVenues
  } = useSelectionState();
  
  const { totalCost, discountedCost, remainingBalance, calculationSummary } = useCostCalculation(
    form,
    selectedPackages,
    packageParticipants,
    accommodationCounts,
    extraBedCounts,
    selectedVenues,
    packages,
    accommodations,
    venues,
    localNightsCount
  );
  
  const { isSubmitting, handleSubmit } = useRegistrationSubmit(
    form,
    selectedClasses,
    selectedPackages,
    packageParticipants,
    totalCost,
    discountedCost,
    extraBedCounts,
    localNightsCount,
    selectedVenues,
    accommodationCounts
  );
  
  const { getSummaryData } = useSummaryData(
    form,
    extraBedCounts,
    totalCost,
    discountedCost,
    remainingBalance,
    localNightsCount,
    accommodationCounts,
    selectedVenues,
    accommodations,
    venues
  );
  
  // Load data for edit mode using the new loader hook
  const { loadGuestRegistration } = useRegistrationLoader({
    editId,
    form,
    handleClassChange,
    setPackageParticipants,
    setSelectedPackages,
    handlePackageChange,
    setAccommodationCounts,
    setExtraBedCounts,
    setSelectedVenues
  });
  
  // Initialize accommodation counts when accommodations are loaded
  useEffect(() => {
    if (accommodations.length > 0 && packages.length > 0) {
      initializeAccommodationCounts(accommodations, packages);
    }
  }, [accommodations, packages]);
  
  return {
    form,
    isSubmitting,
    selectedClasses,
    selectedPackages,
    packageParticipants,
    accommodationCounts,
    extraBedCounts,
    selectedVenues,
    totalCost,
    discountedCost,
    remainingBalance,
    calculationSummary,
    packages,
    accommodations,
    venues,
    handleClassChange,
    handlePackageChange,
    handlePackageParticipantsChange,
    handleAccommodationChange,
    handleExtraBedChange,
    handleVenueChange,
    handleSubmit,
    getSummaryData,
    nightsCount: localNightsCount,
    setNightsCount: setLocalNightsCount
  };
};
