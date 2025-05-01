
import { useState } from 'react';
import { ClassType } from '../types/registrationTypes';

export const useSelectionState = (initialAccommodations: any[] = []) => {
  const [selectedClasses, setSelectedClasses] = useState<ClassType[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [accommodationCounts, setAccommodationCounts] = useState<Record<string, number>>({});
  const [extraBedCounts, setExtraBedCounts] = useState<Record<string, number>>({});
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

  // Initialize accommodation and extra bed counts 
  const initializeAccommodationCounts = (accommodations: any[], packages: any[]) => {
    const initialCounts: Record<string, number> = {};
    const initialExtraBedCounts: Record<string, number> = {};

    // Initialize from accommodations
    accommodations.forEach(accommodation => {
      initialCounts[accommodation.id] = 0;
      initialExtraBedCounts[accommodation.id] = 0;
    });

    // Initialize from packages 
    packages.forEach((pkg: any) => {
      initialCounts[pkg.id] = 0;
    });

    setAccommodationCounts(prev => ({...prev, ...initialCounts}));
    setExtraBedCounts(prev => ({...prev, ...initialExtraBedCounts}));
  };

  const handleClassChange = (classes: ClassType[]) => {
    setSelectedClasses(classes);
  };

  const handlePackageChange = (packageId: string) => {
    setSelectedPackage(packageId === selectedPackage ? '' : packageId);
  };

  const handleAccommodationChange = (id: string, count: number) => {
    setAccommodationCounts(prev => ({
      ...prev,
      [id]: count
    }));
    
    // Reset extra bed count if room count is reduced
    setExtraBedCounts(prev => {
      if (count < prev[id]) {
        return {
          ...prev,
          [id]: 0
        };
      }
      return prev;
    });
  };
  
  const handleExtraBedChange = (id: string, count: number) => {
    setExtraBedCounts(prev => ({
      ...prev,
      [id]: count
    }));
  };

  const handleVenueChange = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedVenues(prev => [...prev, id]);
    } else {
      setSelectedVenues(prev => prev.filter(venueId => venueId !== id));
    }
  };

  return {
    selectedClasses,
    selectedPackage,
    accommodationCounts,
    extraBedCounts,
    selectedVenues,
    initializeAccommodationCounts,
    handleClassChange,
    handlePackageChange,
    handleAccommodationChange,
    handleExtraBedChange,
    handleVenueChange,
  };
};
