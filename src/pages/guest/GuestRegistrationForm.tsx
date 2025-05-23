import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useGuestRegistration, classOptions } from '@/hooks/useGuestRegistration';
import BasicInformationForm from '@/components/registration/forms/BasicInformationForm';
import ClassSelectionForm from '@/components/registration/forms/ClassSelectionForm';
import PackageSelectionForm from '@/components/registration/forms/PackageSelectionForm';
import AccommodationSelectionForm from '@/components/registration/forms/AccommodationSelectionForm';
import VenueSelectionForm from '@/components/registration/forms/VenueSelectionForm';
import CostCalculationForm from '@/components/registration/forms/CostCalculationForm';
import OrderSummary from '@/components/registration/OrderSummary';
import { useAccommodations } from '@/hooks/registration/data/useAccommodations';
import { useRegistrationData } from '@/hooks/registration/useRegistrationData';

const GuestRegistrationForm = () => {
  const navigate = useNavigate();
  const {
    id: editId
  } = useParams<{
    id: string;
  }>();
  const [nightsCount, setNightsCount] = useState(1);
  const { accommodations: allAccommodations } = useRegistrationData();
  const {
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
  } = useGuestRegistration({
    editId,
    nightsCount,
    accommodations: allAccommodations
  });
  
  // Helper to format date as YYYY-MM-DD
  function toDateString(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const checkinDateRaw = form.watch('visit_date');
  let checkinDate = null;
  let checkoutDate = null;
  if (checkinDateRaw && nightsCount) {
    const checkin = new Date(checkinDateRaw);
    if (!isNaN(checkin.getTime())) {
      checkinDate = toDateString(checkin);
      const checkout = new Date(checkin);
      checkout.setDate(checkin.getDate() + Number(nightsCount));
      checkoutDate = toDateString(checkout);
    }
  }
  const { accommodations: availableAccommodations } = useAccommodations(checkinDate, checkoutDate);
  
  const onSubmit = async (values: any) => {
    try {
      console.log('Submitting form with values:', values);
      console.log('Selected venues:', selectedVenues);
      console.log('Accommodation counts:', accommodationCounts);
      
      // Include nights count in the submission
      const registrationId = await handleSubmit({
        ...values,
        nights_count: nightsCount
      });

      // Navigate back to list on success
      if (registrationId) {
        navigate('/visit-list');
      }
    } catch (error) {
      // Error is handled in handleSubmit function
      console.error("Failed to submit form:", error);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/visit-list')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{editId ? 'Edit' : 'New'} Guest Event Order</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <BasicInformationForm form={form} />
          
          {/* Class Selection */}
          <ClassSelectionForm 
            selectedClasses={selectedClasses} 
            onClassChange={handleClassChange} 
            classOptions={classOptions} 
          />
          
          {/* Package Selection */}
          <PackageSelectionForm 
            packages={packages} 
            selectedPackages={selectedPackages}
            packageParticipants={packageParticipants}
            onPackageChange={handlePackageChange}
            onParticipantChange={handlePackageParticipantsChange}
            totalAdults={Number(form.watch("adult_count")) || 0}
            totalChildren={Number(form.watch("children_count")) || 0}
            totalTeachers={Number(form.watch("teacher_count")) || 0}
            totalFreeTeachers={Number(form.watch("free_of_charge_teacher_count")) || 0}
          />
          
          {/* Accommodation Section */}
          <AccommodationSelectionForm 
            accommodations={availableAccommodations} 
            accommodationCounts={accommodationCounts} 
            extraBedCounts={extraBedCounts} 
            onAccommodationChange={handleAccommodationChange} 
            onExtraBedChange={handleExtraBedChange} 
            nightsCount={nightsCount} 
            onNightsCountChange={setNightsCount} 
          />
          
          {/* Venue Section */}
          <VenueSelectionForm 
            venues={venues} 
            selectedVenues={selectedVenues} 
            onVenueChange={handleVenueChange} 
          />
          
          {/* Payment Information */}
          <CostCalculationForm 
            form={form} 
            totalCost={totalCost} 
            discountedCost={discountedCost} 
            remainingBalance={remainingBalance} 
            calculationSummary={calculationSummary} 
          />
          
          {/* Notes and Order Summary */}
          <div className="rounded-3xl">
            <OrderSummary 
              basicInfo={getSummaryData().basicInfo} 
              paymentInfo={getSummaryData().paymentInfo} 
              costCalculation={getSummaryData().costCalculation} 
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/visit-list')}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GuestRegistrationForm;
