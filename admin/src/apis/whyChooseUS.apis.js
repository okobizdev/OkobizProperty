import axiosClient from "../configs/axios.config";

const WhyChooseUsApis = {
  getWhyChooseUsApi: () => {
    return axiosClient.get("/why-choose-us");
  },
  addWhyChooseUsApi: (payload) => {
    return axiosClient.post("/admin/why-choose-us", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editWhyChooseUsApi: (id, payload) => {
    return axiosClient.put(`/admin/why-choose-us/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editWhyChooseUsFieldApi: (id, payload) => {
    return axiosClient.patch(`/admin/why-choose-us/${id}`, payload);
  },
  deleteWhyChooseUsApi: (id) => {
    return axiosClient.delete(`/admin/why-choose-us/${id}`);
  },
};

export default WhyChooseUsApis;
