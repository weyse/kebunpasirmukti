
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from './useGuestRegistrationForm';
import { PackageParticipants } from './useSelectionState';
import { fetchGuestRegistration } from './data/fetchGuestRegistration';
import { ClassType } from '../types/registrationTypes';

interface UseRegistrationLoaderProps {
  editId?: string;
  form: UseFormReturn<FormSchema>;
  handleClassChange: (classes: ClassType[]) => void;
  setPackageParticipants: (participants: PackageParticipants) => void;
  setSelectedPackages: (packages: string[]) => void;
  handlePackageChange: (packageId: string, isInitialLoad?: boolean) => void;
  setAccommodationCounts: (counts: Record<string, number>) => void;
  setExtraBedCounts: (counts: Record<string, number>) => void;
  setSelectedVenues: (venues: string[]) => void;
}

export const useRegistrationLoader = ({
  editId,
  form,
  handleClassChange,
  setPackageParticipants,
  setSelectedPackages,
  handlePackageChange,
  setAccommodationCounts,
  setExtraBedCounts,
  setSelectedVenues
}: UseRegistrationLoaderProps) => {
  
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

  return { loadGuestRegistration };
};
