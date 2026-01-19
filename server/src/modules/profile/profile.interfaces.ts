import { Document, Types } from "mongoose";
import { DocumentType } from "../user/user.enums";
import { AccountStatus } from "../../interfaces/jwtPayload.interfaces";
import { IIdentityDocument, IUser } from "../user/user.interfaces";

export interface IProfile extends Document {
  worksAt: string;
  location: string;
  languages: string[];
  intro: string;
  user: Types.ObjectId;
}

export interface IWorksAtPayload {
  id: Types.ObjectId;
  worksAt: string;
}

export interface ICreateLocationPayload {
  id: Types.ObjectId;
  location: string;
}

export interface ICreateLanguagePayload {
  id: Types.ObjectId;
  languages: string[];
}

export interface IBio {
  id: Types.ObjectId;
  intro: string;
}

export interface IAvatar {
  id: Types.ObjectId;
  avatar: string;
}

export interface IIdentityDocumentPaths {
  filename: string;
}

export interface IIdentityDocumentPayload {
  documents?: string[];
  userId?: Types.ObjectId;
  documentType: DocumentType;
}

export interface ISearchUserQuery {
  role: string;
  user: string;
}

export interface IGetAllUserRequestedQuery {
  role?: string;
  accountStatus?: string;
  page?: number;
  sort?: 1 | -1;
}

export interface IGetAllUserQuery {
  role: string;
  accountStatus?: string;
  isStaff?: Boolean;
}

export interface IGetAllUserPayload {
  query: IGetAllUserQuery;
  page?: number;
  sort?: number;
}

export interface IChangeUserStatus {
  userId?: Types.ObjectId;
  accountStatus?: AccountStatus;
  identityDocument?: Types.ObjectId;
}
export interface IChangeUserStatusRepository {
  updatedUser?: IUser;
  deletedIdentity?: IIdentityDocument;
}

export interface IUpdatePhoneNumber {
  id: Types.ObjectId;
  phone: string;
}
