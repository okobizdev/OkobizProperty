import axiosClient from "../configs/axios.config";

const VisionApis = {
  getVisionsApi: () => {
    return axiosClient.get("/admin/vission");
  },
  addVisionApi: (payload) => {
    return axiosClient.post("/admin/vission", payload);
  },
  editVisionApi: (id, payload) => {
    return axiosClient.put(`/admin/vission/${id}`, payload);
  },
  deleteVisionApi: (id) => {
    return axiosClient.delete(`/admin/vission/${id}`);
  },
};

export default VisionApis;
