import { model, Model, Schema } from 'mongoose';
import IWhyChooseUs from './whyChooseUs.interfaces';

const WhyChooseUsSchema = new Schema<IWhyChooseUs>(
  {
    whyChooseUsTitle: { type: String, default: null },
    whyChooseUsDescription: { type: String, default: null },
    whyChooseUsIcon: { type: String, default: null },
  },
  { timestamps: true }
);

const WhyChooseUs: Model<IWhyChooseUs> = model<IWhyChooseUs>('WhyChooseUs', WhyChooseUsSchema);

export default WhyChooseUs;
