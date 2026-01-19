import { Document, Types } from "mongoose";

export interface IBlogPayload {
  blogTitle?: string;
  blogImage?: string;
  blogVideo?: string;
  blogDescription?: string;
  tags?: string[];
  blogId?: Types.ObjectId;
  blogOldImage?: string;
  slug?: string;
  page?: number;
  limit?: number;
}

export interface IBlogUpdateField {
  field: IBlogInterfces;
  blogId?: Types.ObjectId;
}

export interface IBLogQuery {
  feature?: Types.ObjectId;
}

interface IBlogInterfces extends Document {
  blogTitle?: string;
  blogImage?: string;
  blogVideo?: string;
  blogDescription?: string;
  feature?: Types.ObjectId;
  tags?: string[];
  slug?: string;
}

export default IBlogInterfces;
