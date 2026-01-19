export interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  priceUnit: string;
  size: number;
  sizeUnit: string;
  numberOfRooms: number;
  numberOfWashrooms: number;
  numberOfBalconies: number;
  images: string[];
  video?: string;
  coverImage: string;
  category: string;
  subcategory: string;
  listingType: string;
  duration: string;
  rentDurationType: string;
  amenities: string[];
  host: string;
  publishStatus: string;
  isSold: boolean;
  checkinDate: string;
  checkoutDate: string;
  adultCount: number;
  childrenCount: number;
  blockedDates: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface User {
  _id: string;
  isStaff: boolean;
  avatar: string;
  email: string;
  isVerified: boolean;
  accountStatus: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  userId: User;
  propertyId: Property;
  checkInDate: string | null;
  checkOutDate: string | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string | null;
}
