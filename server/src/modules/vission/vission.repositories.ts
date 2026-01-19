import { IVissionPayload } from "./vission.interfaces";
import Vission from "./vission.models";

const VissionRepositories = {
  createVission: async (payload: IVissionPayload) => {
    try {
      const newVission = new Vission(payload);
      await newVission.save();
      return newVission;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Vission Creation Operation");
    }
  },
  findAllVissions: async () => {
    try {
      const data = await Vission.find({});
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Vission Retrive Operation");
    }
  },
  updateVission: async ({ vissionDescription, vissionId }: IVissionPayload) => {
    try {
      const updatedData = await Vission.findByIdAndUpdate(
        vissionId,
        { $set: { vissionDescription } },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Vission update Operation");
    }
  },
  daleteVission: async ({ vissionId }: IVissionPayload) => {
    try {
      const updatedData = await Vission.findByIdAndDelete(vissionId);
      if (!updatedData) throw new Error("Vission delete fail");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Vission update Operation");
    }
  },
};

export default VissionRepositories;
