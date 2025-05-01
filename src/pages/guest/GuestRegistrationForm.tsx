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
import NotesForm from '@/components/registration/forms/NotesForm';
import OrderSummary from '@/components/registration/OrderSummary';
const GuestRegistrationForm = () => {
  const navigate = useNavigate();
  const {
    id: editId
  } = useParams<{
    id: string;
  }>();
  const [nightsCount, setNightsCount] = useState(1);
  const {
    form,
    isSubmitting,
    selectedClasses,
    selectedPackage,
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
    handleAccommodationChange,
    handleExtraBedChange,
    handleVenueChange,
    handleSubmit,
    getSummaryData
  } = useGuestRegistration({
    editId,
    nightsCount
  });
  const onSubmit = async (values: any) => {
    try {
      // Include nights count in the submission
      const registrationId = await handleSubmit({
        ...values,
        nights_count: nightsCount
      });

      // Navigate back to list on success
      if (registrationId) {
        navigate('/guest-registration');
      }
    } catch (error) {
      // Error is handled in handleSubmit function
      console.error("Failed to submit form:", error);
    }
  };
  return <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/guest-registration')}>
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
          <ClassSelectionForm selectedClasses={selectedClasses} onClassChange={handleClassChange} classOptions={classOptions} />
          
          {/* Package Selection */}
          <PackageSelectionForm packages={packages} selectedPackage={selectedPackage} onPackageChange={handlePackageChange} />
          
          {/* Accommodation Section */}
          <AccommodationSelectionForm accommodations={accommodations} accommodationCounts={accommodationCounts} extraBedCounts={extraBedCounts} onAccommodationChange={handleAccommodationChange} onExtraBedChange={handleExtraBedChange} nightsCount={nightsCount} onNightsCountChange={setNightsCount} />
          
          {/* Venue Section */}
          <VenueSelectionForm venues={venues} selectedVenues={selectedVenues} onVenueChange={handleVenueChange} />
          
          {/* Payment Information */}
          <CostCalculationForm form={form} totalCost={totalCost} discountedCost={discountedCost} remainingBalance={remainingBalance} calculationSummary={calculationSummary} />
          
          {/* Notes and Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 rounded-full">
            
            
            <div>
              <OrderSummary basicInfo={getSummaryData().basicInfo} paymentInfo={getSummaryData().paymentInfo} costCalculation={getSummaryData().costCalculation} />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/guest-registration')}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>;
};
export default GuestRegistrationForm;