import { IVissionPayload } from "./vission.interfaces";
import VissionRepositories from "./vission.repositories";

const { createVission, daleteVission, findAllVissions, updateVission } =
  VissionRepositories;
const VissionServices = {
  processCreateVission: async ({ vissionDescription }: IVissionPayload) => {
    try {
      const data = await createVission({ vissionDescription });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In create vission service");
      }
    }
  },
  processRetrieveAllVissions: async () => {
    try {
      const data = await findAllVissions();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve vission service");
      }
    }
  },
  processUpdateVission: async (payload: IVissionPayload) => {
    try {
      const data = await updateVission(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In update vission service");
      }
    }
  },
  processDeleteVission: async (payload: IVissionPayload) => {
    try {
      const data = await daleteVission(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In delete vission service");
      }
    }
  },
};

export default VissionServices;
