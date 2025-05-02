
import { useState } from 'react';
import { ClassType } from '../types/registrationTypes';

// Define package participant structure
export interface PackageParticipants {
  [packageId: string]: {
    adults: number;
    children: number;
    teachers: number;
    free_teachers: number;
  }
}

export const useSelectionState = (initialAccommodations: any[] = []) => {
  const [selectedClasses, setSelectedClasses] = useState<ClassType[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [packageParticipants, setPackageParticipants] = useState<PackageParticipants>({});
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
    setSelectedPackages(prevSelected => {
      // Toggle package selection
      if (prevSelected.includes(packageId)) {
        // If removing a package, also clear its participant allocations
        const updatedParticipants = { ...packageParticipants };
        delete updatedParticipants[packageId];
        setPackageParticipants(updatedParticipants);
        
        return prevSelected.filter(id => id !== packageId);
      } else {
        // Initialize empty participant allocations for the new package
        setPackageParticipants(prev => ({
          ...prev,
          [packageId]: { adults: 0, children: 0, teachers: 0, free_teachers: 0 }
        }));
        
        return [...prevSelected, packageId];
      }
    });
  };
  
  const handlePackageParticipantsChange = (packageId: string, type: 'adults' | 'children' | 'teachers' | 'free_teachers', count: number) => {
    if (count < 0) return; // Prevent negative values
    
    setPackageParticipants(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [type]: count
      }
    }));
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

  // Add function to set the entire package participants state
  const setAllPackageParticipants = (participants: PackageParticipants) => {
    setPackageParticipants(participants);
  };

  return {
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
    setPackageParticipants: setAllPackageParticipants
  };
};
