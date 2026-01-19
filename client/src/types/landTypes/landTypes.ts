export interface LandCategory {
  _id: string;
  categoryName: string;
  slug: string;
  feature: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LandSearchItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  video: string | null;
  price: number;
  coverImage: string;
  category: LandCategory;
  listingFor: string[];
  landSize: number;
  host: string | null;
  publishStatus: string;
  isSold: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  slug: string;
}

export interface LandSearchResponse {
  success: boolean;
  data: LandSearchItem[];
}
