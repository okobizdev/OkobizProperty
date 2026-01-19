import { Types } from "mongoose";

interface IContacts {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  area?: string;
  thana?: string;
  district?: string;
  property_size?: string;
  property_size_unit?: 'decimal' | 'square_feet' | 'katha' | string;
  budget?: string;

}

export interface IContactsPayload {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  area?: string;
  thana?: string;
  district?: string;
  property_size?: string;
  property_size_unit?: 'decimal' | 'square_feet' | 'katha' | string;
  budget?: string;
  contactMessageId?: Types.ObjectId;
}

export interface IGetAllContactsQuery {
  search?: string;
  page?: number;
  sort?: 1 | -1;
}
export interface IFindQuery {
  email?: string;
}
export interface IGetAllContactsPayload {
  query: IFindQuery;
  page?: number;
  sort?: 1 | -1;
}

export default IContacts;
