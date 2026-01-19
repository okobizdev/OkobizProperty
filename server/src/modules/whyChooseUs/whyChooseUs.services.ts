import { IWhyChooseUsPayload } from './whyChooseUs.interfaces';
import WhyChooseUsRepositories from './whyChooseUs.repositories';
import path, { join } from 'path';
import { promises as fs } from 'fs';

const { createWhyChooseUs, deleteWhyChooseUs, findAllWhyChooseUs, updateWhyChooseUs } =
  WhyChooseUsRepositories;

const WhyChooseUsServices = {
  processCreateWhyChooseUs: async ({
    whyChooseUsTitle,
    whyChooseUsDescription,
    whyChooseUsIcon,
  }: IWhyChooseUsPayload) => {
    const filePath = join(__dirname, '../../../public', whyChooseUsIcon as string);
    console.log(filePath);
    try {
      const data = await createWhyChooseUs({
        whyChooseUsTitle,
        whyChooseUsDescription,
        whyChooseUsIcon: `/public/${whyChooseUsIcon}`,
      });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        await fs.unlink(filePath);
        throw error;
      } else {
        await fs.unlink(filePath);
        throw new Error('Unknown Error Occurred In create WhyChooseUs service');
      }
    }
  },

  processRetrieveAllWhyChooseUs: async () => {
    try {
      const data = await findAllWhyChooseUs();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In retrieve WhyChooseUs service');
      }
    }
  },

  processUpdateWhyChooseUs: async ({
    whyChooseUsDescription,
    whyChooseUsIcon,
    whyChooseUsId,
    whyChooseUsOldIcon,
    whyChooseUsTitle,
  }: IWhyChooseUsPayload) => {
    const image = whyChooseUsOldIcon;
    const relativeImagePath = image && path.basename(image);
    const oldFilePath = image && join(__dirname, '../../../public', relativeImagePath!);
    const newImageFilePath = join(__dirname, '../../../public', whyChooseUsIcon as string);
    try {
      const data = await updateWhyChooseUs({
        whyChooseUsDescription,
        whyChooseUsTitle,
        whyChooseUsId,
        whyChooseUsIcon: `/public/${whyChooseUsIcon}`,
      });
      if (!data) {
        fs.unlink(newImageFilePath);
      }
      oldFilePath && fs.unlink(oldFilePath);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        await fs.unlink(newImageFilePath);
        throw error;
      } else {
        await fs.unlink(newImageFilePath);
        throw new Error('Unknown Error Occurred In update WhyChooseUs service');
      }
    }
  },
  processUpdateWhyChooseUsField: async (payload: IWhyChooseUsPayload) => {
    try {
      const data = await updateWhyChooseUs(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In field update WhyChooseUs service');
      }
    }
  },
  processDeleteWhyChooseUs: async ({ whyChooseUsId, whyChooseUsIcon }: IWhyChooseUsPayload) => {
  const image = whyChooseUsIcon as string;
  const relativeImagePath = image.replace('/public/', '');
  const filePath = join(__dirname, '../../../public', relativeImagePath);
  
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`File not found or could not be deleted: ${filePath}`);
  }
  
  try {
    await deleteWhyChooseUs({ whyChooseUsId });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown Error Occurred In delete WhyChooseUs service');
    }
  }
},
};

export default WhyChooseUsServices;
