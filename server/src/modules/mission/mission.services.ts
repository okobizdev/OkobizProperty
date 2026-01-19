import { IMissionPayload } from "./mission.interfaces";
import MissionRepositories from "./mission.repositories";

const { createMission, daleteMission, findAllMissions, updateMission } =
  MissionRepositories;

const MissionServices = {
  processCreateMission: async ({ missionDescription }: IMissionPayload) => {
    try {
      const data = await createMission({ missionDescription });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In create mission service");
      }
    }
  },
  processRetrieveAllMissions: async () => {
    try {
      const data = await findAllMissions();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve mission service");
      }
    }
  },
  processUpdateMission: async (payload: IMissionPayload) => {
    try {
      const data = await updateMission(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In update mission service");
      }
    }
  },
  processDeleteMission: async (payload: IMissionPayload) => {
    try {
      const data = await daleteMission(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In delete mission service");
      }
    }
  },
};

export default MissionServices;
