
// This is a wrapper for backward compatibility to avoid breaking existing code
import { useVisitData as useVisitDataInternal } from './visit/useVisitData';

export const useVisitData = () => {
  return useVisitDataInternal();
};
