import { Types } from "mongoose";
import {
  IAvatar,
  IBio,
  IChangeUserStatus,
  ICreateLanguagePayload,
  ICreateLocationPayload,
  IGetAllUserPayload,
  IGetAllUserQuery,
  IGetAllUserRequestedQuery,
  IIdentityDocumentPayload,
  ISearchUserQuery,
  IUpdatePhoneNumber,
  IWorksAtPayload,
} from "./profile.interfaces";
import ProfileRepositories from "./profile.repositories";
import User from "../user/user.model";
import { join } from "path";
import { promises as fs } from "fs";
import { AccountStatus } from "../../interfaces/jwtPayload.interfaces";
import IdentityVerificationUtils from "../../utils/identityVerificationEmail.utils";
import { DocumentType } from "../user/user.enums";
import UserRepositories from "../user/user.repositories";

const {
  createWorksAt,
  findWorksAt,
  createUserLocation,
  findLocation,
  createLanguage,
  findLanguage,
  createBio,
  findBio,
  createAvatar,
  findAvatar,
  uploadIdentityDocuments,
  getAllUsers,
  changeUserAccountStatus,
  findFullProfile
} = ProfileRepositories;

const { findUserByEmailOrPhone } = UserRepositories;

const {
  sendApprovedEmailUtils,
  sendRejectionEmailUtils,
  sendSuspendedEmailUtils,
} = IdentityVerificationUtils;

const ProfileServices = {
   processRetrieveFullProfile: async (userId: Types.ObjectId) => {
    try {
      const data = await findFullProfile(userId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve Full Profile Service");
      }
    }
  },
  processCreateWorksAt: async (payload: IWorksAtPayload) => {
    try {
      const data = await createWorksAt(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Create Works At service");
      }
    }
  },
  processRetrieveWorksAt: async (payload: Types.ObjectId) => {
    try {
      const data = await findWorksAt(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In retrieve Works At service");
      }
    }
  },
  processCreateLocation: async (payload: ICreateLocationPayload) => {
    try {
      const data = await createUserLocation(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Create Works At service");
      }
    }
  },
  processRetrieveLocation: async (payload: Types.ObjectId) => {
    try {
      const data = await findLocation(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In retrieve Works At service");
      }
    }
  },
  processCreateLanguage: async (payload: ICreateLanguagePayload) => {
    try {
      console.log(payload);
      const data = await createLanguage(payload);
      console.log(data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Create Language service");
      }
    }
  },
  processRetrieveLanguage: async (payload: Types.ObjectId) => {
    try {
      const data = await findLanguage(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In retrieve Language service");
      }
    }
  },
  processCreateBio: async (payload: IBio) => {
    try {
      const data = await createBio(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Create Bio service");
      }
    }
  },
  processRetrieveBio: async (payload: Types.ObjectId) => {
    try {
      const data = await findBio(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In retrieve bio  service");
      }
    }
  },
  processCreateAvatar: async ({ avatar, id }: IAvatar) => {
    const filePath = join(__dirname, "../../../public", avatar) as string;
    try {
      const data = await createAvatar({ id, avatar: `/public/${avatar}` });
      if (!data) {
        try {
          await fs.unlink(filePath);
          throw new Error("Image Uploading Failed");
        } catch (error) {
          throw error;
        }
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        await fs.unlink(filePath);
        throw error;
      } else {
        await fs.unlink(filePath);
        throw new Error("Unknown Error Occurred In Create Avatar service");
      }
    }
  },
  processRetrieveAvatar: async (payload: Types.ObjectId) => {
    try {
      const data = await findAvatar(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In retrieve avatar service");
      }
    }
  },
  processIdentityUpload: async ({
    documents,
    userId,
    documentType,
  }: IIdentityDocumentPayload) => {
    try {
      const uploadedDocuments = documents?.map(
        (item) => `/public/${item}`
      ) as string[];
      await uploadIdentityDocuments({
        documentType,
        documents: uploadedDocuments,
        userId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred identity upload service");
      }
    }
  },
  processGetAllUsers: async ({
    accountStatus,
    page,
    role,
    sort,
  }: IGetAllUserRequestedQuery) => {
    try {
      const query: IGetAllUserQuery = { role: String(role) };
      const payload: IGetAllUserPayload = { query };
      if (accountStatus) query.accountStatus = accountStatus;
      if (page) payload.page = page;
      if (sort) payload.sort = sort;
      return await getAllUsers(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred get all user service");
      }
    }
  },
  processChangeUserAccountStatus: async ({
    accountStatus,
    identityDocument,
    userId,
  }: IChangeUserStatus) => {
    try {
      switch (accountStatus) {
        case AccountStatus.ACTIVE: {
          const { updatedUser } = await changeUserAccountStatus({
            accountStatus,
            identityDocument,
            userId,
          });
          await sendApprovedEmailUtils({
            name: updatedUser?.name!,
            email: updatedUser?.email!,
          });
          return updatedUser;
        }
        case AccountStatus.SUSPENDED: {
          const { updatedUser } = await changeUserAccountStatus({
            accountStatus,
            identityDocument,
            userId,
          });
          await sendSuspendedEmailUtils({
            name: updatedUser?.name!,
            email: updatedUser?.email!,
          });
          return updatedUser;
        }
        case AccountStatus.REJECTED: {
          const { updatedUser, deletedIdentity } =
            await changeUserAccountStatus({
              accountStatus,
              identityDocument,
              userId,
            });
            
          switch (deletedIdentity?.documentType) {
            case DocumentType.DRIVING_LICENSE:
            case DocumentType.NID: {
              const documents: string[] = [];
              documents[0] = deletedIdentity?.frontSide!;
              documents[1] = deletedIdentity?.backSide!;
              const relativeImagePaths = documents.map((item) =>
                item.replace("/public/", "")
              );
              const filePaths = relativeImagePaths.map((item) =>
                join(__dirname, "../../../public", item)
              );
              for (const item of filePaths) {
                await fs.unlink(item);
              }
              break;
            }
            case DocumentType.PASSPORT: {
              const image = deletedIdentity?.frontSide!;
              const relativeImagePath = image.replace("/public/", "");
              const filePath = join(
                __dirname,
                "../../../public",
                relativeImagePath
              );
              await fs.unlink(filePath);
              break;
            }
          }
          await sendRejectionEmailUtils({
            name: updatedUser?.name!,
            email: updatedUser?.email!,
          });
          return updatedUser;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred change account status service");
      }
    }
  },
  processSearchUser: async ({ role, user }: ISearchUserQuery) => {
    try {
      return await findUserByEmailOrPhone({ role, user });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred search user service");
      }
    }
  },
  processUpdatePhoneNumber: async ({ id, phone }: IUpdatePhoneNumber) => {
    try {
      // Use the UserRepositories to handle user operations
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      user.phone = phone;
      await user.save();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred update phone number service");
      }
    }
  }
};

export default ProfileServices;
