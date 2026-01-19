import { model, Model, Schema } from "mongoose";
import IBanner from "./banner.interfaces";

const BannerSchema = new Schema<IBanner>(
  {
    bannerImage: { type: String, default: null },
  },
  { timestamps: true }
);

const Banner: Model<IBanner> = model<IBanner>("Banner", BannerSchema);

export default Banner;
