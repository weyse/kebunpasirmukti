
import { useState, useEffect } from 'react';
import { useVenues } from './data/useVenues';
import { usePackages } from './data/usePackages';
import { useAccommodations } from './data/useAccommodations';
import { fetchGuestRegistration } from './data/fetchGuestRegistration';
import { ClassType } from '../types/registrationTypes';

export const useRegistrationData = () => {
  const { packages } = usePackages();
  const { accommodations } = useAccommodations();
  const { venues } = useVenues();
  
  return {
    packages,
    accommodations,
    venues,
    fetchGuestRegistration,
  };
};
