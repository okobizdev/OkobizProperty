import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export enum UserRole {
  Host = "host",
  Guest = "guest",
  Admin = "admin",
  ListingVerificationManager = "listingVerificationManager",
  FinanceManager = "financeManager",
  ContentManager = "contentManager",
  AccountAdministrator = "accountAdministrator",
}

export enum AccountStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
  REJECTED = "rejected",
}
export interface TokenPayload extends JwtPayload {
  userId: Types.ObjectId;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  accountStatus: AccountStatus;
}
