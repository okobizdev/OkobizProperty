export interface Subcategory {
  _id: string;
  name: string;
  category: string;
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
  allowedListingTypes: ("RENT" | "SELL" | "LEASE")[];
  requiresDateRange: boolean;
  requiresGuestCount: boolean;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  filterConfig?: any;
  amenitiesConfig?: any;
}
export type Category = {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  subcategories?: Subcategory[];
};