import { Schema, model, Model } from 'mongoose';
import { ILocation } from './location.interfaces';

const LocationSchema = new Schema<ILocation>(
  {
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const Location: Model<ILocation> = model<ILocation>('Location', LocationSchema);


export default Location;
