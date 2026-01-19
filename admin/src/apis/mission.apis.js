import axiosClient from "../configs/axios.config";

const MissionApis = {
  getMissionsApi: () => {
    return axiosClient.get("/admin/mission");
  },
  addMissionApi: (payload) => {
    return axiosClient.post("/admin/mission", payload);
  },
  editMissionApi: (id, payload) => {
    return axiosClient.put(`/admin/mission/${id}`, payload);
  },
  deleteMissionApi: (id) => {
    return axiosClient.delete(`/admin/mission/${id}`);
  },
};

export default MissionApis;
