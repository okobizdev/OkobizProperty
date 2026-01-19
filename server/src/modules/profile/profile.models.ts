import mongoose, { Model, model, Schema } from "mongoose";
import { IProfile } from "./profile.interfaces";

const ProfileSchema = new Schema<IProfile>({
  intro: { type: String, default: null },
  languages: {type:[{ type: String, default: null }],default:null},
  location: { type: String, default: null },
  worksAt: { type: String, default: null },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    default: null,
  },
},{timestamps:true});

const Profile: Model<IProfile> = model<IProfile>("Profile", ProfileSchema);

export default Profile;
