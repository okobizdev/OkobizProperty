import { HydratedDocument, Model, model, Schema, Types } from "mongoose";
import { IIdentityDocument, IUser } from "./user.interfaces";
import { hashPassword } from "../../utils/password.utils";
import { AccountStatus } from "../../interfaces/jwtPayload.interfaces";

const UserSchema = new Schema<IUser>(
  {
    isStaff: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    email: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    accountStatus: { type: String, default: AccountStatus.INACTIVE },
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String , default: null },
    password: { type: String, minlength: 8, required: true },
    role: { type: String },
    identityDocument: {
      type: Schema.Types.ObjectId,
      ref: "IdentityDocument",
    },
  },
  { timestamps: true }
);

const IdentityDocumentSchema = new Schema<IIdentityDocument>(
  {
    documentType: { type: String, default: null },
    frontSide: { type: String, default: null },
    backSide: { type: String, default: null },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
UserSchema.index({ identityDocument: 1 }, { unique: true, sparse: true });
IdentityDocumentSchema.index({ user: 1 }, { unique: true, sparse: true });

UserSchema.pre("save", async function (next) {
  const user = this as HydratedDocument<IUser>;
  if (user.isModified("password") || user.isNew) {
    try {
      user.password = (await hashPassword(user.password)) as string;
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
});

export const IdentityDocument: Model<IIdentityDocument> =
  model<IIdentityDocument>("IdentityDocument", IdentityDocumentSchema);

const User: Model<IUser> = model<IUser>("User", UserSchema);

export default User;
