
import { useState } from 'react';

export const useVisitFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState('');
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedActivityType('');
  };

  return {
    searchTerm,
    selectedStatus,
    selectedActivityType,
    setSearchTerm,
    setSelectedStatus,
    setSelectedActivityType,
    resetFilters
  };
};
