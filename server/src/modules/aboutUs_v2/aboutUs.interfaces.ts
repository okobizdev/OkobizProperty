import { Document } from "mongoose";

// Service Subdocument
export interface IService {
  title: string;
  description?: string;
  icon?: string;
  image?: string;
  features?: string[];
  isActive?: boolean;
  order?: number;
}

// Company Overview Subdocument
export interface ICompanyOverview {
  title?: string;
  description?: string;
  foundingYear?: number;
  companySize?: string;
  industry?: string;
  headquarters?: string;
  backgroundImage?: string;
}

// CEO Speech Subdocument
export interface ICEOSpeech {
  title?: string;
  content?: string;
  videoUrl?: string;
  ceoName?: string;
  ceoPosition?: string;
  ceoImage?: string;
}

// Main AboutUs Document Interface
export interface IAboutUsDocument extends Document {
  companyOverview?: ICompanyOverview;
  ceoSpeech?: ICEOSpeech;
  services?: IService[];
}
