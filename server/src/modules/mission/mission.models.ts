import { model, Model, Schema } from "mongoose";
import IMission from "./mission.interfaces";


const MissionSchema = new Schema<IMission>(
  {
    missionDescription: { type: String, default: null },
  },
  { timestamps: true }
);

const Mission: Model<IMission> = model<IMission>("Mission", MissionSchema);

export default Mission;
