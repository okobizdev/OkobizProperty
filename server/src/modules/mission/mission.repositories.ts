import { IMissionPayload } from "./mission.interfaces";
import Mission from "./mission.models";

const MissionRepositories = {
  createMission: async (payload: IMissionPayload) => {
    try {
      const newMission = new Mission(payload);
      await newMission.save();
      return newMission;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Mission Creation Operation");
    }
  },
  findAllMissions: async () => {
    try {
      const data = await Mission.find({});
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Mission Retrive Operation");
    }
  },
  updateMission: async ({ missionDescription, missionId }: IMissionPayload) => {
    try {
      const updatedData = await Mission.findByIdAndUpdate(
        missionId,
        { $set: { missionDescription } },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Mission update Operation");
    }
  },
  daleteMission: async ({ missionId }: IMissionPayload) => {
    try {
      const updatedData = await Mission.findByIdAndDelete(missionId);
      if (!updatedData) throw new Error("Mission delete fail");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Mission update Operation");
    }
  },
};

export default MissionRepositories;
