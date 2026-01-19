import { model, Model, Schema } from "mongoose";
import IPartner from "./partner.interfaces";

const PartnerSchema = new Schema<IPartner>(
  {
    partnerImage: { type: String, default: null },
  },
  { timestamps: true }
);

const Partner: Model<IPartner> = model<IPartner>("Partner", PartnerSchema);

export default Partner;
