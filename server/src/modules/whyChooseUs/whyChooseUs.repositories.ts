import { IWhyChooseUsPayload } from './whyChooseUs.interfaces';
import WhyChooseUs from './whyChooseUs.models';

const WhyChooseUsRepositories = {
  createWhyChooseUs: async (payload: IWhyChooseUsPayload) => {
    try {
      const newWhyChooseUs = new WhyChooseUs(payload);
      await newWhyChooseUs.save();
      return newWhyChooseUs;
    } catch (error) {
      throw new Error('Unknown Error Occurred In WhyChooseUs Creation Operation');
    }
  },
  findOne: async ({ whyChooseUsId }: IWhyChooseUsPayload) => {
    try {
      const data = await WhyChooseUs.findOne({ _id: whyChooseUsId });
      return data;
    } catch (error) {
      throw new Error('Unknown Error Occurred In WhyChooseUs Retrieve One  Operation');
    }
  },
  findAllWhyChooseUs: async () => {
    try {
      const data = await WhyChooseUs.find({});
      return data;
    } catch (error) {
      throw new Error('Unknown Error Occurred In WhyChooseUs Retrieve Operation');
    }
  },

  updateWhyChooseUs: async ({
    whyChooseUsTitle,
    whyChooseUsDescription,
    whyChooseUsIcon,
    whyChooseUsId,
  }: IWhyChooseUsPayload) => {
    try {
      const updatedData = await WhyChooseUs.findByIdAndUpdate(
        whyChooseUsId,
        { $set: { whyChooseUsTitle, whyChooseUsDescription, whyChooseUsIcon } },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw new Error('Unknown Error Occurred In WhyChooseUs Update Operation');
    }
  },

  deleteWhyChooseUs: async ({ whyChooseUsId }: IWhyChooseUsPayload) => {
    try {
      const deletedData = await WhyChooseUs.findByIdAndDelete(whyChooseUsId);
      if (!deletedData) throw new Error('WhyChooseUs delete failed');
      return;
    } catch (error) {
      throw new Error('Unknown Error Occurred In WhyChooseUs Delete Operation');
    }
  },
};

export default WhyChooseUsRepositories;
