import { Document } from 'mongoose';

export interface IAmenity extends Document {
  label: string;
  image?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
