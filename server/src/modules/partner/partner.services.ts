import { join } from "path";
import { IPartnerPayload } from "./partner.interfaces";
import PartnerRepositories from "./partner.repositories";
import { promises as fs } from "fs";

const { createPartner, deletePartner, findAllPartners, updatePartner } =
  PartnerRepositories;

const PartnerServices = {
  processCreatePartner: async ({ partnerImage }: IPartnerPayload) => {
    const filePath = join(
      __dirname,
      "../../../public",
      partnerImage as string
    ) as string;
    try {
      const data = await createPartner({
        partnerImage: `/public/${partnerImage}`,
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
        throw new Error("Unknown Error Occurred In create partner service");
      }
    }
  },

  processRetrieveAllPartners: async () => {
    try {
      const data = await findAllPartners();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In retrieve partner service");
      }
    }
  },

  processUpdatePartner: async ({
    partnerImage,
    partnerId,
  }: IPartnerPayload) => {
    const filePath = join(
      __dirname,
      "../../../public",
      partnerImage as string
    ) as string;
    try {
      const data = await updatePartner({
        partnerImage: `/public/${partnerImage}`,
        partnerId,
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
        throw new Error("Unknown Error Occurred In create partner service");
      }
    }
  },

  processDeletePartner: async ({
  partnerId,
  partnerImage,
}: IPartnerPayload) => {
  console.log("working", partnerImage, partnerId);
  const image = partnerImage as string;
  const relativeImagePath = image.replace("/public/", "");
  const filePath = join(__dirname, "../../../public", relativeImagePath);
  
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Log file deletion error but continue to delete from database
    console.warn(`File not found or could not be deleted: ${filePath}`);
  }
  
  try {
    await deletePartner({ partnerId });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown Error Occurred In delete partner service");
    }
  }
},

};

export default PartnerServices;
