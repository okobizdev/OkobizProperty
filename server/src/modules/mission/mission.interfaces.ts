import { Document, Types } from "mongoose";

interface IMission extends Document {
  missionDescription: string;
}

export interface IMissionPayload {
  missionDescription?: string;
  missionId?: Types.ObjectId;
}

export default IMission;
