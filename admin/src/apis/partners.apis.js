import axiosClient from "../configs/axios.config";

const PartnersApis = {
  getPartnerApi: () => {
    return axiosClient.get("/admin/partner");
  },
  addPartnerApi: (payload) => {
    return axiosClient.post("/admin/partner", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editPartnerApi: (id, payload) => {
    return axiosClient.put(`/admin/partner/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deletePartnerApi: (id) => {
    return axiosClient.delete(`/admin/partner/${id}`);
  },
};

export default PartnersApis;
