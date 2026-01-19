import ContactsApis from "../apis/contacts.apis";

const { deleteContactMessage, getAllContactsMessages } = ContactsApis;

const ContactsServices = {
  processGetAllContacts: async ({ search, sort, page }) => {
    try {
      const data = await getAllContactsMessages({ search, sort, page });
      console.log("data in service == ", data);
      return data?.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Unknown Error Occurred In Get All Contact Service");
    }
  },
  processDeleteContactMessage: async ({ id }) => {
    try {
      const data = await deleteContactMessage({ id });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Unknown Error Occurred In Get Delete Contact Service");
    }
  },
};

export default ContactsServices;
