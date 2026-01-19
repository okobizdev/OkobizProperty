export interface FloorPlan {
  unitCount: number;
  drawing: boolean;
  dinning: boolean;
  balconyCount: number;
  bedroomCount: number;
  bathroomCount: number;
}

export enum ListingPublishStatus {
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export interface Listing {
  _id: string;
  title: string | null;
  description: string | null;
  location: string | null;
  images: string[] | null;
  video: string | null;
  price: number | null;
  coverImage: string | null;
  category: string | null;
  listingFor: string[];
  buildingYear: number | null;
  floorPlan: FloorPlan;
  amenities: string[] | null;
  host: string;
  publishStatus: ListingPublishStatus;
  isSold: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ListingResponse {
  status: string;
  message: string;
  data: Listing;
}
