import mailTransporter from "../../configs/nodemailer.configs";
import { env } from "../../env";
import {
  IContactsPayload,
  IFindQuery,
  IGetAllContactsPayload,
  IGetAllContactsQuery,
} from "./contacts.interfaces";
import ContactsRepositories from "./contacts.repositories";
const { createContactMessage, deleteOneContactMessage, findContactMessages } =
  ContactsRepositories;

const ContactsServices = {
  processCreateContactMessage: async ({
    email,
    message,
    name,
    phone,
    subject,
    area,
    thana,
    district,
    property_size,
    property_size_unit,
    budget
  }: IContactsPayload) => {
    try {
      await createContactMessage({
        email,
        message,
        name,
        phone,
        subject,
        area,
        thana,
        district,
        property_size,
        property_size_unit,
        budget
      });
      await mailTransporter.sendMail({
        from: env.SMTP_USER,
        to: env.SMTP_USER,
        replyTo: email,
        subject,
        text: `
Name: ${name || ""}
Phone: ${phone || ""}
Email: ${email || ""}
Subject: ${subject || ""}
Area: ${area || ""}
Thana: ${thana || ""}
District: ${district || ""}
Property Size: ${property_size || ""} ${property_size_unit || ""}
Budget: ${budget || ""}
Message: ${message || ""}
  `.trim(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Create Contact Message Service"
        );
      }
    }
  },
  processDeleteContactMessage: async ({
    contactMessageId,
  }: IContactsPayload) => {
    try {
      return await deleteOneContactMessage({ contactMessageId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Delete Contact Message Service"
        );
      }
    }
  },
  processFindAllContactsMessages: async ({
    page,
    search,
    sort,
  }: IGetAllContactsQuery) => {
    try {
      const query: IFindQuery = {};
      if (search) query.email = search;
      const payload: IGetAllContactsPayload = { query };
      if (page) payload.page = page;
      if (sort) payload.sort = sort;
      return findContactMessages(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred Find All Listed Contacts Messages Service"
        );
      }
    }
  },
};

export default ContactsServices;
