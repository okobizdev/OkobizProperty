import { IBannerPayload } from "./banner.interfaces";
import Banner from "./banner.models";

const BannerRepositories = {
  createBanner: async (payload: IBannerPayload) => {
    try {
      const newBanner = new Banner(payload);
      await newBanner.save();
      return newBanner;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Banner Creation Operation");
    }
  },

  findAllBanners: async () => {
    try {
      const data = await Banner.find({});
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Banner Retrieve Operation");
    }
  },

  deleteBanner: async ({ bannerId }: IBannerPayload) => {
    try {
      console.log(bannerId);
      const deletedData = await Banner.findByIdAndDelete(bannerId);
      if (!deletedData) throw new Error("Banner delete failed");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Banner Delete Operation");
    }
  },
    findBannerById: async ({ bannerId }: IBannerPayload) => {
    try {
      console.log('bannerId', bannerId);
      const banner = await Banner.findById(bannerId);
      // if (!banner) throw new Error("Banner not found");
      return banner;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Banner FindById Operation");
    }
  },
};

export default BannerRepositories;
