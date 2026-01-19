import { Document, Types } from 'mongoose';

interface IWhyChooseUs extends Document {
  whyChooseUsIcon: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
}

export interface IWhyChooseUsPayload {
  whyChooseUsIcon?: string;
  whyChooseUsOldIcon?: string;
  whyChooseUsTitle?: string;
  whyChooseUsDescription?: string;
  whyChooseUsId?: Types.ObjectId;
}

export default IWhyChooseUs;
