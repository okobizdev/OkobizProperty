import { Document, Types } from "mongoose";

interface IBanner extends Document {
  bannerImage: string;
}

export interface IBannerPayload {
  bannerImage?: string;
  bannerId?: Types.ObjectId;
}

export default IBanner;
