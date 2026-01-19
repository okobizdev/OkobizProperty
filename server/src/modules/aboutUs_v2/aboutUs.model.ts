import { Schema, model } from "mongoose";
import { IAboutUsDocument, IService, ICompanyOverview, ICEOSpeech } from "./aboutUs.interfaces";

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: String,
  icon: String,
  image: String,
  features: [String],
  isActive: { type: Boolean, default: true },
  order: Number,
});

const CompanyOverviewSchema = new Schema<ICompanyOverview>({
  title: String,
  description: String,
  foundingYear: Number,
  companySize: String,
  industry: String,
  headquarters: String,
  backgroundImage: String,
});

const CEOSpeechSchema = new Schema<ICEOSpeech>({
  title: String,
  content: String,
  videoUrl: String,
  ceoName: String,
  ceoPosition: String,
  ceoImage: String,
});

const AboutUsSchema = new Schema<IAboutUsDocument>(
  {
    companyOverview: CompanyOverviewSchema,
    ceoSpeech: CEOSpeechSchema,
    services: [ServiceSchema],
  },
  { timestamps: true }
);

export const AboutUs = model<IAboutUsDocument>("AboutUs", AboutUsSchema);
