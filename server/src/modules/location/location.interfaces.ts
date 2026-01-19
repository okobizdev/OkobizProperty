import { Types } from 'mongoose';

export enum LocationStatus {
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export interface ILocation {
  _id?: Types.ObjectId;
  location: String;
  page?: number;
  limit?: number;

}
