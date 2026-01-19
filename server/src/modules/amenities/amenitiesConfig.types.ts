import { Types, Document } from 'mongoose';

export interface IAmenitiesConfig extends Document {
  subcategory: Types.ObjectId;
  availableAmenities: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
