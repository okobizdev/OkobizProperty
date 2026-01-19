import HostManagementApis from "../apis/hostManagement.apis";

const { getAllHosts, changeAccountStatus, deleteAnUser, searchHost } =
  HostManagementApis;

const HostManagementServices = {
  processGetAllHost: async (accountStaus, page, sort) => {
    try {
      const data = await getAllHosts(accountStaus, page, sort);
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Occured In Process Get All Host");
      }
    }
  },
  processChangeAccountStatus: async (id, payload) => {
    try {
      const data = await changeAccountStatus(id, payload);
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Occured In Process Host Account Status");
      }
    }
  },
  processHostDelete: async (id) => {
    try {
      const data = await deleteAnUser(id);
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Occured In Process Host Delete");
      }
    }
  },
  processSearchHost: async (user) => {
    try {
      const data = await searchHost(user);
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Occured In Process Host Delete");
      }
    }
  },
};

export default HostManagementServices;
