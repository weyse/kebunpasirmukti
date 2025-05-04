
import { useGuestRegistration as useGuestRegistrationInternal, classOptions, EXTRA_BED_PRICE } from './registration/useGuestRegistration';
import type { ClassType, PackageParticipants, VisitType, PaymentStatus } from './registration/useGuestRegistration';

// Re-export for backward compatibility
export { classOptions, EXTRA_BED_PRICE };
export type { ClassType, PackageParticipants, VisitType, PaymentStatus };

interface UseGuestRegistrationProps {
  editId?: string;
  nightsCount?: number;
}

// This is a wrapper for backward compatibility
export const useGuestRegistration = (props: UseGuestRegistrationProps = {}) => {
  return useGuestRegistrationInternal(props);
};
