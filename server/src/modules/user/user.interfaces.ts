import { Document, Types } from "mongoose";
import {
  AccountStatus,
  UserRole,
} from "../../interfaces/jwtPayload.interfaces";
import { DocumentType } from "./user.enums";

export interface IUser extends Document {
  isStaff: Boolean;
  avatar: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  password: string;
  profile: Types.ObjectId;
  accountStatus: AccountStatus;
  identityDocument: Types.ObjectId;
  address?: string;
}

export interface IUserPayload {
  isStaff?: Boolean;
  avatar?: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  isVerified?: boolean;
  password?: string;
  profile?: Types.ObjectId;
  accountStatus?: AccountStatus;
  identityDocument?: Types.ObjectId;
  userId?:Types.ObjectId;
}

export interface ISignupPayload {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ITokenProcessReturn {
  accessToken: string;
  refreshToken: string;
}

export interface IProcessDeleteUserPayload {
  id: Types.ObjectId;
}

export interface ISearchUserDatabaseQuery {
  email: {
    $regex: string;
    $options: string;
  };
  role: string;
}

export interface IProcessResendEmailPayload {
  name: string;
  email: string;
}

export interface IIdentityDocument extends Document {
  documentType?: DocumentType;
  frontSide?: string;
  backSide?: string;
  user?: Types.ObjectId;
}

export interface IFindStaffRequestQuery {
  search?: string;
  role?: string;
  page?: number;
}
export interface IFindStaffQuery {
  email?: {
    $regex: string;
    $options: string;
  };
  role?: string;
  isStaff?: Boolean;
}
export interface IFindStaffPayload {
  query: IFindStaffQuery;
  page?: number;
}
