
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useGuestRegistrationForm } from './registration/useGuestRegistrationForm';
import { useRegistrationData } from './registration/useRegistrationData';
import { useCostCalculation } from './registration/useCostCalculation';
import { useRegistrationSubmit } from './registration/useRegistrationSubmit';
import { useSelectionState, PackageParticipants } from './registration/useSelectionState';
import { useSummaryData } from './registration/useSummaryData';
import { ClassType, classOptions } from './types/registrationTypes';

// Re-export for backward compatibility
export { EXTRA_BED_PRICE } from './registration/useCostCalculation';
export { classOptions };
export type { ClassType, PackageParticipants };
export type { VisitType, PaymentStatus } from './registration/useRegistrationSubmit';

interface UseGuestRegistrationProps {
  editId?: string;
  nightsCount?: number;
}

export const useGuestRegistration = ({ editId, nightsCount = 1 }: UseGuestRegistrationProps = {}) => {
  // Custom hooks
  const form = useGuestRegistrationForm();
  const { packages, accommodations, venues, fetchGuestRegistration } = useRegistrationData();
  
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
    nightsCount
  );
  
  const { isSubmitting, handleSubmit } = useRegistrationSubmit(
    form,
    selectedClasses,
    selectedPackages,
    packageParticipants,
    totalCost,
    discountedCost,
    extraBedCounts,
    nightsCount
  );
  
  const { getSummaryData } = useSummaryData(
    form,
    extraBedCounts,
    totalCost,
    discountedCost,
    remainingBalance,
    nightsCount
  );
  
  // Initialize accommodation counts when accommodations are loaded
  useEffect(() => {
    if (accommodations.length > 0 && packages.length > 0) {
      initializeAccommodationCounts(accommodations, packages);
    }
  }, [accommodations, packages]);
  
  // Load data for edit mode
  useEffect(() => {
    if (editId) {
      loadGuestRegistration(editId);
    }
  }, [editId]);
  
  const loadGuestRegistration = async (id: string) => {
    try {
      const { registrationData, classes } = await fetchGuestRegistration(id);
      
      if (registrationData) {
        // Format the visit_date and payment_date if they exist
        const formattedVisitDate = registrationData.visit_date ? new Date(registrationData.visit_date) : new Date();
        const formattedPaymentDate = registrationData.payment_date ? new Date(registrationData.payment_date) : null;
        
        // Convert payment_status enum to boolean
        const paymentStatusBool = registrationData.payment_status === 'lunas';
        
        // Update form values
        form.reset({
          id: registrationData.id, // Set the id field
          responsible_person: registrationData.responsible_person || '',
          institution_name: registrationData.institution_name || '',
          phone_number: registrationData.phone_number || '',
          address: registrationData.address || '',
          visit_date: formattedVisitDate,
          adult_count: String(registrationData.adult_count) || '0',
          children_count: String(registrationData.children_count) || '0',
          teacher_count: String(registrationData.teacher_count) || '0',
          free_of_charge_teacher_count: String(registrationData.free_of_charge_teacher_count || '0'),
          notes: registrationData.notes || '',
          document_url: registrationData.document_url || '',
          discount_percentage: String(registrationData.discount_percentage) || '0',
          down_payment: String(registrationData.down_payment) || '0',
          payment_date: formattedPaymentDate,
          bank_name: registrationData.bank_name || '',
          payment_status: paymentStatusBool,
        });
        
        // Set selected classes
        handleClassChange(classes);
        
        // Set package type if any
        if (registrationData.package_type) {
          handlePackageChange(registrationData.package_type);
        }
        
        // TODO: Load package participants from database when available
      }
    } catch (error) {
      console.error("Failed to load guest registration:", error);
    }
  };

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
    getSummaryData
  };
};
