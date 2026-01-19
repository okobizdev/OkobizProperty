import { Document, Types } from "mongoose";

interface IPartner extends Document {
  partnerImage: string;
}

export interface IPartnerPayload {
  partnerImage?: string;
  partnerId?: Types.ObjectId;
}

export default IPartner;
