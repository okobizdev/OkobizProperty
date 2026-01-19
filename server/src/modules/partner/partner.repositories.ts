import { IPartnerPayload } from "./partner.interfaces";
import Partner from "./partner.models";

const PartnerRepositories = {
  createPartner: async (payload: IPartnerPayload) => {
    try {
      const newPartner = new Partner(payload);
      await newPartner.save();
      return newPartner;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Partner Creation Operation");
    }
  },

  findAllPartners: async () => {
    try {
      const data = await Partner.find({});
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Partner Retrieve Operation");
    }
  },

  updatePartner: async ({ partnerImage, partnerId }: IPartnerPayload) => {
    try {
      console.log(partnerId);
      const updatedData = await Partner.findByIdAndUpdate(
        partnerId,
        { $set: { partnerImage } },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Partner Update Operation");
    }
  },

  deletePartner: async ({ partnerId }: IPartnerPayload) => {
    try {
      const deletedData = await Partner.findByIdAndDelete(partnerId);
      if (!deletedData) throw new Error("Partner delete failed");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Partner Delete Operation");
    }
  },
  findOnePartner: async ({ partnerId }: IPartnerPayload) => {
    try {
      const data = await Partner.findById(partnerId);
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Partner Delete Operation");
    }
  },
};

export default PartnerRepositories;
