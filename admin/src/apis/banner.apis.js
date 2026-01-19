import axiosClient from "../configs/axios.config";

const BannerApis = {
  getBannerApi: () => {
    return axiosClient.get("/admin/banner");
  },

  addBannerApi: (payload) => {
    return axiosClient.post("/admin/banner", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteBannerApi: (id) => {
    return axiosClient.delete(`/admin/banner/${id}`);
  },
};

export default BannerApis;
