import mongoose, { Types } from 'mongoose';
import Profile from '../profile/profile.models';
import {
  IFindStaffPayload,
  IProcessResendEmailPayload,
  ISearchUserDatabaseQuery,
  ISignupPayload,
  IUser,
  IUserPayload,
} from './user.interfaces';
import User, { IdentityDocument } from './user.model';
import { ISearchUserQuery } from '../profile/profile.interfaces';
import { documentPerPage } from '../../const';
import { comparePassword, hashPassword } from '../../utils/password.utils';
import redisClient from '../../configs/redis.configs';
import sendVerificationEmail from '../../utils/sendVerificationEmail.utils';
import otpGenerator from "otp-generator";

const UserRepositories = {
  createUser: async ({ email, name, password, role, phone }: ISignupPayload): Promise<IUser> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = new User({
        name,
        role,
        password,
        email,
        phone,
      });
      const profile = new Profile({ user: user.id });
      user.profile = profile._id as Types.ObjectId;
      const savedUser = await user.save({ session });
      await profile.save({ session });
      await session.commitTransaction();
      session.endSession();
      return savedUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Creation Repository');
      }
    }
  },
  findUserByEmail: async (email: string): Promise<IUser | null> => {
    try {
      const foundedUser = await User.findOne({ email });
      if (!foundedUser) return null;
      return foundedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Repository');
      }
    }
  },
  findUserByEmailAndRole: async (email: string, role: string): Promise<IUser | null> => {
    try {
      const foundedUser = await User
        .findOne({ email, role })
      if (!foundedUser) return null;
      return foundedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Repository');
      }
    }
  },

  findUserByEmailOrPhone: async ({ role, user }: ISearchUserQuery): Promise<IUser | null> => {
    try {
      const query = { role } as ISearchUserDatabaseQuery;
      if (typeof user === 'string' && user.trim() !== '') {
        query.email = { $regex: user.trim(), $options: 'i' };
      }
      const foundedUser = await User.findOne(query).populate({
        path: 'identityDocument',
        select: '_id documentType frontSide backSide',
      });
      if (!foundedUser) return null;
      return foundedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Repository');
      }
    }
  },
  verifyUser: async (email: string, role: string) => {
    try {
      const verifiedUserData = await User.findOneAndUpdate(
        { email, role },
        { isVerified: true },
        { new: true }
      );
      return verifiedUserData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Repository');
      }
    }
  },
  deleteUser: async (payload: Types.ObjectId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const deletedUserData = await User.findByIdAndDelete(payload);
      await Profile.findOneAndDelete({ user: payload });
      const deletedIdentityData = deletedUserData?.identityDocument
        ? await IdentityDocument.findByIdAndDelete(deletedUserData?.identityDocument)
        : null;
      session.endSession();
      return { deletedUserData, deletedIdentityData };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Delete Repository');
      }
    }
  },
  findAllStaff: async ({ page, query }: IFindStaffPayload) => {
    try {
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * documentPerPage;
      const [data, total] = await Promise.all([
        User.find(query).limit(documentPerPage).skip(skip),
        User.countDocuments(query),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Staff Retrieve Repository');
      }
    }
  },
  createStaff: async ({ email, name, password, role }: ISignupPayload) => {
    try {
      const newStaff = new User({
        name,
        email,
        role,
        password,
        isVerified: true,
        isStaff: true,
      });
      await newStaff.save();
      return newStaff;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Staff Creation Repository');
      }
    }
  },
  deleteStaff: async (payload: Types.ObjectId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const deletedUserData = await User.findByIdAndDelete(payload);
      await Profile.findOneAndDelete({ user: payload });
      session.endSession();
      return { deletedUserData };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Staff Delete Repository');
      }
    }
  },
  changeStaffPassword: async ({ password, userId }: IUserPayload) => {
    try {
      const hashedPassword = await hashPassword(password!);
      const data = await User.findByIdAndUpdate(
        userId,
        {
          $set: { password: hashedPassword },
        },
        { new: true }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Staff Password Change Repository');
      }
    }
  },
  changeUserPassword: async ({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      if (!user.password) {
        throw new Error("User has no password set");
      }

      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) throw new Error("Old password is incorrect");

      const hashedPassword = await hashPassword(newPassword);
      if (!hashedPassword) {
        throw new Error("Password hashing failed");
      }

      const data = await User.findByIdAndUpdate(
        userId,
        {
          $set: { password: hashedPassword },
        },
        { new: true }
      );

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In User Password Change");
      }
    }

  },
  findUserByEmailPassword: async (email: string) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to find user by email");
    }
  },
  findUserByEmailForResetOtp: async (email: string, role: string) => {
    try {
      const user = await User.findOne({ email, role });
      return user;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to find user by email");
    }
  },
  resendForgotPasswordOtp: async ({ email, name }: IProcessResendEmailPayload) => {
    try {
      const resendKey = `user:reset-otp:resend-limit:${email}`;
      const isLimited = await redisClient.get(resendKey);

      if (isLimited) {
        throw new Error("Please wait before requesting another OTP.");
      }

      await redisClient.set(resendKey, "1", "EX", 60);

      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });

      await redisClient.set(`user:reset-otp:${email}`, otp, "EX", 5 * 60); 

      await sendVerificationEmail({
        email,
        name,
        otp,
        expirationTime: 5,
      });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Unknown Error Occurred In Resend OTP Operation");
    }
  },
  findUserByEmailResetPass: async (email: string, newPassword: string) => {
  try {
    const hashedPassword = await hashPassword(newPassword);

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return user;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Error resetting user password");
  }
}
,
  // findUserByEmailResetPass: async (
  //   email: string,
  //   newPassword: string
  // ) => {
  //   try {
  //     const user = await User.findOne({ email });
  //     if (!user) return null;

  //     const hashedPassword = await hashPassword(newPassword);
  //     console.log("DB password: ", user.password);
  //     user.password = hashedPassword;
  //     // await user.save();

  //     return user;
  //   } catch (error) {
  //     throw error instanceof Error
  //       ? error
  //       : new Error("Error resetting user password");
  //   }
  // },

  changeStaffRole: async ({ role, userId }: IUserPayload) => {
    try {
      const data = await User.findByIdAndUpdate(
        userId,
        {
          $set: { role },
        },
        { new: true }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Staff Role Change Repository');
      }
    }
  },
};

export default UserRepositories;
