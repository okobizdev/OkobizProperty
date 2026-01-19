import { model, Model, Schema } from "mongoose";
import IVission from "./vission.interfaces";

const VissionSchema = new Schema<IVission>(
  {
    vissionDescription: { type: String, default: null },
  },
  { timestamps: true }
);

const Vission: Model<IVission> = model<IVission>("Vission", VissionSchema);

export default Vission;
