import { IBannerPayload } from "./banner.interfaces";
import BannerRepositories from "./banner.repositories";
import { promises as fs } from "fs";
import { join } from "path";

const { createBanner, deleteBanner, findAllBanners } = BannerRepositories;

const BannerServices = {
  processCreateBanner: async ({ bannerImage }: IBannerPayload) => {
    const filePath = join(__dirname, "../../../public", bannerImage as string);
    try {
      const data = await createBanner({
        bannerImage: `/public/${bannerImage}`,
      });
      if (!data) {
        try {
          await fs.unlink(filePath);
          throw new Error("Image Uploading Failed");
        } catch (error) {
          throw error;
        }
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        await fs.unlink(filePath);
        throw error;
      } else {
        await fs.unlink(filePath);
        throw new Error("Unknown Error Occurred In create banner service");
      }
    }
  },

  processRetrieveAllBanners: async () => {
    try {
      const data = await findAllBanners();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In retrieve banner service");
      }
    }
  },

processDeleteBanner: async ({ bannerId }: IBannerPayload) => {
  try {
    console.log("bannerId", bannerId);
    const banner = await BannerRepositories.findBannerById({bannerId});
    console.log("banner", banner);
    if (!banner) throw new Error("Banner not found");

    // const image = banner.bannerImage as string;
    //     console.log("image", image);
    // const relativeImagePath = image.replace("/public/", "");
    // const filePath = join(__dirname, "../../../public", relativeImagePath);

    // await fs.unlink(filePath);

    await BannerRepositories.deleteBanner({ bannerId });

    return;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown Error Occurred In delete banner service");
    }
  }
},
};

export default BannerServices;
