import axiosClient from "../configs/axios.config";


const adminAboutApis = {
  getAboutUsApi: () => {
    return axiosClient.get("/admin/about_us");
  },
  addAboutUsApi: (payload) => {
    return axiosClient.post("/admin/about_us", payload);
  },
  editAboutUsApi: (id, payload) => {
    return axiosClient.put(`/admin/about_us/${id}`, payload);
  },
  deleteAboutUsApi: (id) => {
    return axiosClient.delete(`/admin/about_us/${id}`);
  },

};

export default adminAboutApis;