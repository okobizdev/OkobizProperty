import GuestManagementApis from "../apis/guestManagement.apis";

const { getAllGuests, changeAccountStatus, deleteAnUser, searchGuest } =
  GuestManagementApis;

const GuestManagementServices = {
  processGetAllGuest: async (accountStaus, page, sort) => {
    try {
      const data = await getAllGuests(accountStaus, page, sort);
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Occured In Process Get All Guest");
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
        throw new Error("Unknown Occured In Process Guest Account Status");
      }
    }
  },
  processGuestDelete: async (id) => {
    try {
      const data = await deleteAnUser(id);
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Occured In Process Guest Delete");
      }
    }
  },
  processSearchGuest: async (user) => {
    try {
      const data = await searchGuest(user);
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Occured In Process Guest Delete");
      }
    }
  },
};

export default GuestManagementServices;
