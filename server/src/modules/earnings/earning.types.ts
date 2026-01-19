export interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  completedEarnings: number;
  refundedEarnings: number;
  totalBookings: number;
  averageProfitMargin: number;
  currency: string;
}

export interface MonthlyEarnings {
  month: string;
  year: number;
  totalEarnings: number;
  grossEarnings: number;
  bookingsCount: number;
}

export interface PropertyEarnings {
  _id: string;
  propertyTitle: string;
  propertyLocation: string;
  totalBookings: number;
  totalGrossEarnings: number;
  averageProfitMargin: number;
  totalNetEarnings: number;
  currency: string;
}
