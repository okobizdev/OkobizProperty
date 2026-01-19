import ProfileApis from "@/app/apis/profile.apis";
import { IProfileResponse } from "@/types/profileTypes/profiletypes";

export const ProfileServices = {
  processGetProfile: async (): Promise<IProfileResponse> => {
    try {
      const res = await ProfileApis.getProfileApi();
      return res.data as IProfileResponse;
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error("Unknown error occurred while fetching profile");
    }
  },
  processGetSslSuccess: async (bookingId: string) => {
    try {
      const res = await ProfileApis.getSslSuccessApi(bookingId);
      return res.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error("Unknown error occurred while fetching booking");
    }
  }
};
