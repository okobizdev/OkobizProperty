import { model, Model, Schema, Document } from "mongoose";

interface ICompanyContacts extends Document {
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyContactsSchema = new Schema<ICompanyContacts>(
  {
    mobile: {
      type: String,
      required: true,
      trim: true,
      default: "01904108303"
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
      default: "01904108303"
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "sorower.jahan@okobiz.com"
    },
    address: {
      type: String,
      required: true,
      trim: true,
      default: "213/1, 60 Feet Kamal Soroni Rd, Dhaka 1216, Bangladesh"
    },

  },
  { timestamps: true }
);

const CompanyContacts = model<ICompanyContacts>("Contactsinfo", CompanyContactsSchema);

export default CompanyContacts;
