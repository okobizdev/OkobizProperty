export interface Feature {
  _id: string;
  featureName: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface FeatureResponse {
  status: string;
  message?: string;
  data: Feature[];
}
export type FeatureType = "flat" | "rent" | "land";
export interface CreateListingPayload {
  featureType: FeatureType;
  featureId: string;
}
