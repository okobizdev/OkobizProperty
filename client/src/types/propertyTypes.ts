// export interface Property {
//   _id: string;
//   title: string;
//   description: string;
//   location: string;
//   price: number;
//   priceUnit: string;
//   size: number;
//   sizeUnit: string;
//   numberOfRooms: number;
//   numberOfWashrooms: number;
//   numberOfBalconies: number;
//   images: string[];
//   video: string;
//   coverImage: string;
//   category: { _id: string; name: string } | null;
//   subcategory: { _id: string; name: string; id?: string } | null;
//   listingType: string;
//   duration: string | null;
//   rentDurationType: string | null;
//   amenities: any[];
//   host: string;
//   publishStatus: string;
//   isSold: boolean;
//   checkinDate: string | null;
//   checkoutDate: string | null;
//   adultCount: number;
//   childrenCount: number;
//   blockedDates: string[];
//   createdAt: string;
//   updatedAt: string;
//   slug: string;
//   __v: number;
// }

export interface PropertiesResponse {
  total: number;
  page: number;
  limit: number;
  properties: Property[];
}
// types.ts
import type { Dayjs } from "dayjs";

export interface Category {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
}

export interface Amenity {
  _id: string;
  name?: string;
  label?: string;
}

export type PublishStatus =
  | "IN_PROGRESS"
  | "PUBLISHED"
  | "DRAFT"
  | "SOLD"
  | "RENTED";

export type ListingType = "RENT" | "SELL";

export interface Property {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  location?: string;
  price?: number;
  priceUnit?: string;
  size?: number;
  sizeUnit?: string;
  numberOfRooms?: number;
  numberOfWashrooms?: number;
  numberOfBalconies?: number;
  numberOfBedrooms?: number;
  numberOfGuests?: number;
  airConditioning?: boolean;
  category?: Category | string;
  subcategory?: SubCategory | string;
  listingType: ListingType;
  duration?: string;
  rentDurationType?:
    | "MONTHLY"
    | "YEARLY"
    | "SIX_MONTHS"
    | "DAILY"
    | "WEEKLY"
    | "HOURLY"
    | "FLEXIBLE";
  amenities?: (Amenity | string)[];
  video?: string;
  publishStatus?: PublishStatus;
  adultCount?: number;
  childrenCount?: number;
  checkinDate?: string;
  checkoutDate?: string;
  blockedDates?: string[];
  images?: string[];
  coverImage?: string;
  name?: string;
  bedType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormValues {
  title: string;
  description?: string;
  location?: string;
  price?: number;
  priceUnit?: string;
  size?: number;
  sizeUnit?: string;
  numberOfRooms?: number;
  numberOfWashrooms?: number;
  numberOfBalconies?: number;
  category?: string;
  subcategory?: string;
  listingType: ListingType;
  duration?: string;
  rentDurationType?:
    | "MONTHLY"
    | "YEARLY"
    | "SIX_MONTHS"
    | "DAILY"
    | "WEEKLY"
    | "HOURLY"
    | "FLEXIBLE";
  amenities?: string[];
  video?: string;
  publishStatus?: PublishStatus;
  adultCount?: number;
  childrenCount?: number;
  checkinDate?: Dayjs | null;
  checkoutDate?: Dayjs | null;
  blockedDates?: Dayjs[];
}
