import { Types, Document } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  category: Types.ObjectId;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  allowedListingTypes: ('RENT' | 'SELL')[];
  requiresDateRange: boolean;
  requiresGuestCount: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string; // URL of the uploaded image
}
