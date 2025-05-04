
export interface PackageParticipantCost {
  packageId: string;
  packageName: string;
  adults: number;
  adultCost: number;
  children: number;
  childrenCost: number;
  teachers: number;
  teacherCost: number;
  free_teachers: number;
  total: number;
}

export interface CostCalculationSummary {
  adultCost: number;
  childrenCost: number;
  childrenDiscountAmount: number;
  teacherCost: number;
  accommodationCost: number;
  extraBedCost: number;
  venueCost: number;
  subtotal: number;
  finalTotal: number;
  freeTeachersCount: number;
  packageBreakdown: PackageParticipantCost[];
}
