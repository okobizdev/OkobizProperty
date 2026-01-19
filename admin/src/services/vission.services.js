import VisionApis from "../apis/vission.apis";

const { addVisionApi, getVisionsApi, editVisionApi, deleteVisionApi } =
  VisionApis;

const VisionServices = {
  processGetVision: async () => {
    try {
      const response = await getVisionsApi();
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processAddVision: async (payload) => {
    try {
      const response = await addVisionApi(payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processEditVision: async (id, payload) => {
    try {
      console.log(id, payload);
      const response = await editVisionApi(id, payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processDeleteVision: async (id) => {
    try {
      const response = await deleteVisionApi(id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};

export default VisionServices;
