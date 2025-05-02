
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useGuestRegistrationForm } from './useGuestRegistrationForm';
import { useRegistrationData } from './useRegistrationData';
import { useCostCalculation } from './useCostCalculation';
import { useRegistrationSubmit } from './useRegistrationSubmit';
import { useSelectionState } from './useSelectionState';
import { useSummaryData } from './useSummaryData';
import { ClassType, classOptions } from './types/registrationTypes';
import { fetchGuestRegistration } from './data/fetchGuestRegistration';

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
    nightsCount,
    selectedVenues,
    accommodationCounts
  );
  
  const { getSummaryData } = useSummaryData(
    form,
    extraBedCounts,
    totalCost,
    discountedCost,
    remainingBalance,
    nightsCount,
    accommodationCounts,
    selectedVenues,
    accommodations,
    venues
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
      const { registrationData, classes, packagesData, roomsData, venuesData } = await fetchGuestRegistration(id);
      
      if (registrationData) {
        // Format the visit_date and payment_date if they exist
        const formattedVisitDate = registrationData.visit_date ? new Date(registrationData.visit_date) : new Date();
        const formattedPaymentDate = registrationData.payment_date ? new Date(registrationData.payment_date) : null;
        
        // Convert payment_status enum to boolean
        const paymentStatusBool = registrationData.payment_status === 'lunas';
        
        // Cast registrationData to handle the free_of_charge_teacher_count field
        const typedData = registrationData as any;
        
        // Update form values, safely handle free_of_charge_teacher_count which might not exist in older records
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
          // Safely access free_of_charge_teacher_count with fallback to '0'
          free_of_charge_teacher_count: String(typedData.free_of_charge_teacher_count || 0),
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
        
        // Handle packages data
        if (packagesData && packagesData.selected_packages && packagesData.package_participants) {
          console.log('Loading packages data:', packagesData);
          
          // Important: First set the package participants data before selecting packages
          // This ensures participant data isn't reset during package selection
          setPackageParticipants(packagesData.package_participants);
          
          // Then set the selected packages directly without toggling
          setSelectedPackages(packagesData.selected_packages);
        }
        // For legacy data that only has package_type
        else if (registrationData.package_type) {
          handlePackageChange(registrationData.package_type);
        }

        // Handle rooms data
        if (roomsData) {
          console.log('Loading rooms data:', roomsData);
          
          if (roomsData.accommodation_counts) {
            setAccommodationCounts(roomsData.accommodation_counts);
          }
          
          if (roomsData.extra_bed_counts) {
            setExtraBedCounts(roomsData.extra_bed_counts);
          }
        }

        // Handle venues data
        if (venuesData && venuesData.selected_venues) {
          console.log('Loading venues data:', venuesData);
          setSelectedVenues(venuesData.selected_venues);
        }
      }
    } catch (error) {
      console.error("Failed to load guest registration:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data registrasi tamu.",
        variant: "destructive",
      });
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
