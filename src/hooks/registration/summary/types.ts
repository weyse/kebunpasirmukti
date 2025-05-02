
export interface SummaryItem {
  label: string;
  value: string;
}

export interface RoomVenueItem {
  name: string;
  count?: number;
  price?: number;
}

export interface SummaryData {
  basicInfo: SummaryItem[];
  paymentInfo: SummaryItem[];
  costCalculation: {
    baseTotal: number;
    discountedTotal: number;
    remaining: number;
  };
  roomsInfo: RoomVenueItem[];
  venuesInfo: RoomVenueItem[];
}
