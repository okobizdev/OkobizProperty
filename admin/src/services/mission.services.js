import MissionApis from "../apis/mission.apis";

const { addMissionApi, getMissionsApi, editMissionApi, deleteMissionApi } =
  MissionApis;

const MissionServices = {
  processGetMission: async () => {
    try {
      const response = await getMissionsApi();
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processAddMission: async (payload) => {
    try {
      const response = await addMissionApi(payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processEditMission: async (payload, id) => {
    try {
      const response = await editMissionApi(payload, id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processDeleteMission: async (id) => {
    try {
      const response = await deleteMissionApi(id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};

export default MissionServices;
