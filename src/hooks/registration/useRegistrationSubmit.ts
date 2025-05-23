import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FormSchema } from './useGuestRegistrationForm';
import { ClassType } from '../types/registrationTypes';
import { PackageParticipants } from './useSelectionState';

export type PaymentStatus = 'belum_lunas' | 'lunas';
export type VisitType = 'wisata_edukasi' | 'outbound' | 'camping' | 'field_trip' | 'penelitian' | 'lainnya';

export const useRegistrationSubmit = (
  form: UseFormReturn<FormSchema>,
  selectedClasses: ClassType[],
  selectedPackages: string[],
  packageParticipants: PackageParticipants,
  totalCost: number,
  discountedCost: number,
  extraBedCounts: Record<string, number>,
  nightsCount: number = 1,
  selectedVenues: string[] = [],
  accommodationCounts: Record<string, number> = {},
  accommodations: any[] = []
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formValues: FormSchema) => {
    try {
      setIsSubmitting(true);
      
      // Calculate total guests including free teachers
      const totalGuests = Number(formValues.adult_count) + Number(formValues.children_count) + 
                         Number(formValues.teacher_count) + Number(formValues.free_of_charge_teacher_count || 0);
      
      // Map the boolean payment_status to the expected enum values
      const dbPaymentStatus: PaymentStatus = formValues.payment_status ? 'lunas' : 'belum_lunas';
      
      // Map visit type based on class selection
      let dbVisitType: VisitType = 'lainnya';
      if (selectedClasses.some(c => ['kb_tk', 'sd_1_2', 'sd_3_4', 'sd_5_6', 'smp', 'sma'].includes(c))) {
        dbVisitType = 'wisata_edukasi';
      }
      
      // Format visit_date and payment_date to ISO string format for database
      const visitDateForDB = formValues.visit_date ? 
        new Date(formValues.visit_date.getTime() - formValues.visit_date.getTimezoneOffset() * 60000).toISOString().split('T')[0] : 
        null;
      const paymentDateForDB = formValues.payment_date ? 
        new Date(formValues.payment_date.getTime() - formValues.payment_date.getTimezoneOffset() * 60000).toISOString().split('T')[0] : 
        null;
      
      // Calculate extra bed cost for inclusion in submission (accounting for nights count)
      const extraBedCost = Object.values(extraBedCounts).reduce((sum, count) => sum + (count * 160000 * nightsCount), 0);
      
      // Clean up packageParticipants to only include selected packages
      const cleanedPackageParticipants: PackageParticipants = {};
      selectedPackages.forEach(packageId => {
        if (packageParticipants[packageId]) {
          cleanedPackageParticipants[packageId] = {
            adults: packageParticipants[packageId].adults || 0,
            children: packageParticipants[packageId].children || 0,
            teachers: packageParticipants[packageId].teachers || 0,
            free_teachers: packageParticipants[packageId].free_teachers || 0
          };
        }
      });
      
      // Prepare package participants JSON data
      const packagesData = {
        selected_packages: selectedPackages,
        package_participants: cleanedPackageParticipants
      };
      
      // Prepare rooms JSON data
      const roomsData = {
        accommodation_counts: accommodationCounts,
        extra_bed_counts: extraBedCounts
      };

      // Prepare venues JSON data
      const venuesData = {
        selected_venues: selectedVenues
      };
      
      // Log the data being saved
      console.log('Saving packages data:', packagesData);
      console.log('Saving rooms data:', roomsData);
      console.log('Saving venues data:', venuesData);
      
      // Prepare data for submission
      const submissionData = {
        responsible_person: formValues.responsible_person,
        institution_name: formValues.institution_name,
        phone_number: formValues.phone_number,
        address: formValues.address || '',
        visit_date: visitDateForDB,
        adult_count: Number(formValues.adult_count),
        children_count: Number(formValues.children_count),
        teacher_count: Number(formValues.teacher_count),
        free_of_charge_teacher_count: Number(formValues.free_of_charge_teacher_count || 0),
        visit_type: dbVisitType,
        // We're still storing a single package_type for backward compatibility,
        // using the first selected package or null if none selected
        package_type: selectedPackages.length > 0 ? selectedPackages[0] : null,
        notes: formValues.notes || '',
        document_url: formValues.document_url || '',
        total_cost: totalCost,
        discount_percentage: Number(formValues.discount_percentage || 0),
        discounted_cost: discountedCost,
        down_payment: Number(formValues.down_payment || 0),
        payment_date: paymentDateForDB,
        bank_name: formValues.bank_name || '',
        payment_status: dbPaymentStatus,
        extra_bed_cost: extraBedCost,
        nights_count: nightsCount,
        // Store JSON data in their respective columns
        packages_json: packagesData,
        rooms_json: roomsData,
        venues_json: venuesData
      };

      let registrationId;
      let isNewRegistration = !formValues.id;
      
      if (isNewRegistration) {
        // For new registrations, make sure we NEVER include order_id
        // Let the database trigger handle it completely
        const { data: insertedData, error } = await supabase
          .from('guest_registrations')
          .insert(submissionData)
          .select();
        
        if (error) {
          console.error("Registration error:", error);
          throw new Error(`Registration failed: ${error.message}`);
        }
        
        if (insertedData && insertedData.length > 0) {
          registrationId = insertedData[0].id;
          console.log("Successfully created registration with ID:", registrationId);
          console.log("Generated order_id:", insertedData[0].order_id);
        } else {
          throw new Error("Failed to get ID from inserted registration");
        }
      } else {
        // Update existing record - never update the order_id
        const { data: updatedData, error } = await supabase
          .from('guest_registrations')
          .update(submissionData)
          .eq('id', formValues.id)
          .select();
        
        if (error) {
          console.error("Update error:", error);
          throw new Error(`Update failed: ${error.message}`);
        }
        
        registrationId = formValues.id;
        console.log("Successfully updated registration with ID:", registrationId);
      }
      
      // If we have a registration ID, save the selected classes
      if (registrationId && selectedClasses.length > 0) {
        // First delete any existing classes for this registration
        if (!isNewRegistration) {
          await supabase
            .from('guest_classes')
            .delete()
            .eq('registration_id', registrationId);
        }
        
        // Then insert the new classes - make sure to type them correctly
        for (const classType of selectedClasses) {
          const { error: classError } = await supabase
            .from('guest_classes')
            .insert({
              registration_id: registrationId,
              class_type: classType
            });
          
          if (classError) throw new Error(classError.message);
        }
      }
      
      // Insert bookings into accommodations table for each selected room
      const checkinDate = visitDateForDB;
      const checkoutDate = formValues.visit_date && nightsCount
        ? new Date(new Date(formValues.visit_date).getTime() + nightsCount * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0]
        : null;
      for (const [roomId, count] of Object.entries(accommodationCounts)) {
        if (count > 0 && checkinDate && checkoutDate) {
          const room = accommodations.find((r) => r.id === roomId);
          const pricePerNight = room ? Number(room.price) || 0 : 0;
          const cost = pricePerNight * count * nightsCount;
          const { error: bookingError } = await supabase
            .from('accommodations')
            .insert({
              registration_id: registrationId,
              room_id: roomId,
              checkin_date: checkinDate,
              checkout_date: checkoutDate,
              nights_count: nightsCount,
              room_count: count,
              cost,
              status: 'confirmed'
            });
          if (bookingError) throw new Error(bookingError.message);
        }
      }
      
      toast({
        title: "Success!",
        description: isNewRegistration ? "Guest registration created successfully." : "Guest registration updated successfully.",
      });
      
      return registrationId;
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
