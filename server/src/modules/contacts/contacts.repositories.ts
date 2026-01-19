import { documentPerPage } from "../../const";
import {
  IContactsPayload,
  IGetAllContactsPayload,
  IGetAllContactsQuery,
} from "./contacts.interfaces";
import Contacts from "./contacts.model";


const ContactsRepositories = {
  createContactMessage: async (payload: IContactsPayload) => {
    try {
      const newMessage = new Contacts(payload);
      return newMessage.save();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Create Contact Message Repository"
        );
      }
    }
  },
  deleteOneContactMessage: async ({ contactMessageId }: IContactsPayload) => {
    try {
      return await Contacts.findByIdAndDelete(contactMessageId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Delete Contact Message Repository"
        );
      }
    }
  },
  findContactMessages: async ({
    page,
    query,
    sort,
  }: IGetAllContactsPayload) => {
    try {
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * documentPerPage;
      const sortValue = Number(sort);
      const sortOption: Record<string, 1 | -1> =
        sortValue === 1 || sortValue === -1
          ? { createdAt: sortValue as 1 | -1 }
          : { createdAt: -1 };
      // const sortOption: Record<string, 1 | -1> | undefined =
      //   sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
      const [data, total] = await Promise.all([
        Contacts.find(query).skip(skip).limit(documentPerPage).sort(sortOption),
        Contacts.countDocuments(),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Delete Contact Message Repository"
        );
      }
    }
  },
};

export default ContactsRepositories;
