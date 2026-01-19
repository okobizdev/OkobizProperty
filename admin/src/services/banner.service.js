import BannerApis from "../apis/banner.apis";

const { getBannerApi, addBannerApi, deleteBannerApi } = BannerApis;

const BannerServices = {
  processGetBanners: async () => {
    try {
      const response = await getBannerApi();
      return response?.data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processGetBanners");
      }
    }
  },

  processAddBanner: async (payload) => {
    try {
      const response = await addBannerApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processAddBanner");
      }
    }
  },

  processDeleteBanner: async (id) => {
    try {
      const response = await deleteBannerApi(id);

      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processDeleteBanner");
      }
    }
  },
};

export default BannerServices;
