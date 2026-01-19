import { Document, Types } from "mongoose";

interface IVission extends Document {
  vissionDescription: string;
}

export interface IVissionPayload {
  vissionDescription?: string;
  vissionId?: Types.ObjectId;
}

export default IVission;
