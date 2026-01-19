export type TBanner = {
  _id: string;
  bannerImage: string;
  createdAt: string;
  updatedAt: string;
};

export type TAmenity = {
  _id: string;
  amenitiesLabel: string;
  amenitiesImage: string;
};

export type TFloorPlan = {
  bedRoomCount: number;
  bathCount: string;
  bedCount: number;
  guestCount: number;
};
export enum AccountStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
  REJECTED = "rejected",
}

export type TRoomDetails = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  amenities: TAmenity[];
  floorPlan: TFloorPlan;
  price: number;
  location: string;
};

export interface IChoose {
  _id: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  whyChooseUsIcon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICategory {
  _id: string;
  categoryName: string;
  feature: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAmenities {
  _id: string;
  amenitiesLabel: string;
  amenitiesImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IFloorPlan {
  bedroomCount: number;
  bathCount: number;
  bathroomCount: number;
  balconyCount: number;
  bedCount: number;
  guestCount: number;
  drawing: boolean;
  dinning: boolean;
  bedRoomCount: number;
}

export interface IHost {
  _id: string;
  avatar: string | null;
  email: string;
  isVerified: boolean;
  accountStatus: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  identityDocument: string;
  isStaff: boolean;
}

export interface IListingFor {
  _id: string;
  featureName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IRent {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  selected: boolean;
  images: string[];
  isSold: boolean;
  category: ICategory;
  amenities: IAmenities[];
  allowableThings: string[];
  floorPlan: IFloorPlan;
  cancellationPolicy: string[];
  host: IHost;
  houseRules: string[];
  listingFor: IListingFor[];
  location: string;
  landSize: number;
  buildingYear: string;
  price: number;
  slug: string;
  status: string;
  publishStatus: string;
  checkinDate: Date;
  checkoutDate: Date;
  __v: number;
}
export interface IFlatRoot {
  status: string;
  message: string;
  data: IFlatData[];
}

export interface IFlatData {
  _id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  video: any;
  price: number;
  coverImage: string;
  category: string;
  listingFor: any[];
  buildingYear: any;
  floorPlan: FloorPlan;
  amenities: string[];
  host: string;
  publishStatus: string;
  isSold: boolean;
  latitude: any;
  longitude: any;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface FloorPlan {
  unitCount: number;
  drawing: boolean;
  dinning: boolean;
  balconyCount: number;
  bedroomCount: number;
  bathroomCount: number;
}

export interface ILandRoot {
  status: string;
  message: string;
  data: ILandData[];
}

export interface ILandData {
  _id: string;
  title?: string;
  description?: string;
  location: string;
  images?: string[];
  video: any;
  price?: number;
  coverImage?: string;
  category: string;
  listingFor: any[];
  landSize?: number;
  host: string;
  publishStatus: string;
  isSold: boolean;
  latitude: any;
  longitude: any;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface IBooking {
  _id: string;
  rent: IRent;
  rentHost?: {
    _id: string;
    isStaff: boolean;
    avatar: string | null;
    email: string;
    isVerified: boolean;
    accountStatus: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    identityDocument?: string | null;
  };
  user?: {
    _id: string;
    isStaff: boolean;
    avatar: string | null;
    email: string;
    isVerified: boolean;
    accountStatus: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  checkinDate: string;
  checkoutDate: string;
  guestCount: number;
  price: number;
  status: string;
  updateRole: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
