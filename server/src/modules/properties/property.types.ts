import { Types, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description?: string;
  location?: string;
  price: number;
  priceUnit?: string;
  images: string[];
  video?: string;
  coverImage?: string | null;
  amenities?: Types.ObjectId[];
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  listingType: 'RENT' | 'SELL';
  filters: Map<string, any>;
  host: Types.ObjectId;
  publishStatus: 'IN_PROGRESS' | 'PUBLISHED' | 'SOLD';
  slug: string;
  latitude?: number;
  longitude?: number;
  isSold: boolean;
  checkinDate?: Date;
  checkoutDate?: Date;
  adultCount?: number;
  childrenCount?: number;
  createdAt: Date;
  updatedAt: Date;
  numberOfRooms?: number;
  numberOfWashrooms?: number;
  numberOfBalconies?: number;
  numberOfBedrooms?: number;
  numberOfGuests?: number;
  airConditioning?: boolean;
  size?: number;
  sizeUnit?: 'sqft' | 'sqm';
  duration?: string;
  rentDurationType?: 'MONTHLY' | 'YEARLY' | 'SIX_MONTHS' | 'DAILY' | 'WEEKLY' | 'HOURLY' | 'FLEXIBLE';
  blockedDates?: Date[]; // Dates when the property is blocked for bookings
  startingDate?: Date;
  isFeatured?: boolean;
  bedType?: string;
  smokingAllowed?: boolean;
}
