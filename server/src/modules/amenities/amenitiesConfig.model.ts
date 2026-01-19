import { Schema, model, Model } from 'mongoose';
import { IAmenitiesConfig } from './amenitiesConfig.types';

const AmenitiesConfigSchema = new Schema<IAmenitiesConfig>(
  {
    subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true, unique: true },
    availableAmenities: [{ type: Schema.Types.ObjectId, ref: 'Amenity', default: [] }],
  },
  { timestamps: true }
);

const AmenitiesConfig: Model<IAmenitiesConfig> = model<IAmenitiesConfig>(
  'AmenitiesConfig',
  AmenitiesConfigSchema
);

export default AmenitiesConfig;