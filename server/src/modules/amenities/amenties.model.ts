import { Schema, model, Model } from 'mongoose';
import { IAmenity } from './amenties.types'; // <-- Use the separated type

const AmenitySchema = new Schema<IAmenity>(
  {
    label: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Amenity: Model<IAmenity> = model<IAmenity>('Amenity', AmenitySchema);

export default Amenity;