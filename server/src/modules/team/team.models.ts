import { model, Model, Schema } from "mongoose";
import ITeam from "./team.interfaces";

const TeamSchema = new Schema<ITeam>(
  {
    teamMemberName: { type: String, required: true },
    teamMemberDesignation: { type: String, required: true },
    teamMemberImage: { type: String, default: null },
  },
  { timestamps: true }
);

const Team: Model<ITeam> = model<ITeam>("Team", TeamSchema);

export default Team;
