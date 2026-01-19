import { AccountStatus } from "@/utilits/accountstatusEnum";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: "guest" | "host";
  accountStatus: AccountStatus;
  avatar: string | null;
  isStaff: boolean;
  isVerified: boolean;
  identityDocument?: string;
  worksAt?: string;
  location?: string;
  languages?: string[];
  intro?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfile {
  _id: string;
  intro: string | null;
  languages: string[] | null;
  location: string | null;
  worksAt: string | null;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileResponse {
  status: string;
  message: string;
  data: IProfile;
}
