import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import ProfileServices from "./profile.services";
import {
  AccountStatus,
  TokenPayload,
} from "../../interfaces/jwtPayload.interfaces";
import {
  IGetAllUserRequestedQuery,
  IIdentityDocumentPaths,
  ISearchUserQuery,
} from "./profile.interfaces";
import { IIdentityDocument } from "../user/user.interfaces";
import { documentPerPage } from "../../const";
import mongoose from "mongoose";

const {
  processCreateWorksAt,
  processRetrieveWorksAt,
  processCreateLocation,
  processRetrieveLocation,
  processCreateLanguage,
  processRetrieveLanguage,
  processCreateBio,
  processRetrieveBio,
  processCreateAvatar,
  processRetrieveAvatar,
  processIdentityUpload,
  processGetAllUsers,
  processChangeUserAccountStatus,
  processSearchUser,
  processRetrieveFullProfile,
  processUpdatePhoneNumber,
} = ProfileServices;
const ProfileControllers = {
   handleGetMyProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processRetrieveFullProfile(userId);
      res.status(200).json({
        status: "success",
        message: "Profile info retrieved successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateWorksAt: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { worksAt } = req.body;
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processCreateWorksAt({ id: userId, worksAt });
      res
        .status(201)
        .json({ status: "success", message: "Works at added", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetWorksAt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processRetrieveWorksAt(userId);
      res
        .status(200)
        .json({ status: "success", message: "Works at retrieved", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateLocation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { location } = req.body;
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processCreateLocation({ id: userId, location });
      res
        .status(201)
        .json({ status: "success", message: "location added", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetLocation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processRetrieveLocation(userId);
      res
        .status(200)
        .json({ status: "success", message: "location retrieved", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateLanguage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { languages } = req.body;
      console.log(languages);
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processCreateLanguage({ id: userId, languages });
      res
        .status(200)
        .json({ status: "success", message: "languages updated", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetLanguage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processRetrieveLanguage(userId);
      res
        .status(200)
        .json({ status: "success", message: "languages retrieved", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateBio: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bio } = req.body;
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processCreateBio({ id: userId, intro: bio });
      res.status(200).json({ status: "success", message: "bio updated", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetBio: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processRetrieveBio(userId);
      res
        .status(200)
        .json({ status: "success", message: "bio retrieved successful", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateAvatar: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const avatar = req?.file?.filename as string;
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processCreateAvatar({ id: userId, avatar });
      res
        .status(200)
        .json({ status: "success", message: "avatar updated", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processRetrieveAvatar(userId);
      res.status(200).json({
        status: "success",
        message: "avatar retrieved successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleIdentityUpload: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const documents = (req?.files as IIdentityDocumentPaths[])?.map(
        (item) => item.filename
      );
      const { documentType } = req.body;
      await processIdentityUpload({ userId, documents, documentType });
      res.status(200).json({
        status: "success",
        message: "Identity document upload successful",
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdatePhoneNumber: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phone } = req.body;
      const { userId } = req.authenticateTokenDecoded as TokenPayload;
      const data = await processUpdatePhoneNumber({ id: userId, phone });
      res.status(200).json({ status: "success", message: "phone number updated", data });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetAllUsers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { accountStatus, page, role, sort }: IGetAllUserRequestedQuery =
        req.query;
        console.log("req.sort:",sort);
        console.log("req.query:", req.query);
      const { data, total } = await processGetAllUsers({
        accountStatus,
        page,
        role,
        sort,
      });
      const totalPages = Math.ceil(total / documentPerPage);
      const totalUsers = total;
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
        req.path
      }`;
      const buildQuery = (pageNumber: number) => {
        const query = new URLSearchParams();

        if (role) query.set("role", role);
        if (accountStatus) query.set("accountStatus", accountStatus);
        if (sort) query.set("sort", String(sort));
        query.set("page", String(pageNumber));
        return `${baseUrl}?${query.toString()}`;
      };
      const currentPage = Number(page) || 1;
      const currentPageUrl = buildQuery(currentPage);
      const nextPageUrl =
        currentPage < totalPages ? buildQuery(currentPage + 1) : null;
      const previousPageUrl =
        currentPage > 1 ? buildQuery(currentPage - 1) : null;
      res.status(200).json({
        status: "success",
        message: `All ${accountStatus} request found successful`,
        totalUsers,
        totalPages,
        currentPageUrl,
        nextPageUrl,
        previousPageUrl,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleSearchUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, user } = req.query;
      const data = await processSearchUser({
        role: String(role),
        user: String(user),
      });
      if (data) {
        res.status(200).json({
          status: "success",
          message: `Search user found successful`,
          data,
        });
      } else {
        res.status(400).json({
          status: "error",
          message: `Search user with this ${user} not found`,
          data,
        });
      }
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleChangeUserIdentityStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { identityDocument, accountStatus } = req.body;
      console.log("accountStatus:", accountStatus);
      console.log("identityDocument:", identityDocument);
      console.log("id:", id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid partner ID" });
        return;
      }

      const userId = new mongoose.Types.ObjectId(id);
      switch (accountStatus) {
        case AccountStatus.ACTIVE: {
          const data = await processChangeUserAccountStatus({
            identityDocument,
            accountStatus,
            userId,
          });
          res.status(200).json({
            status: "success",
            message: "User Is Now Active",
            data,
          });
          return;
        }
        case AccountStatus.SUSPENDED: {
          const data = await processChangeUserAccountStatus({
            identityDocument,
            accountStatus,
            userId,
          });
          res.status(200).json({
            status: "success",
            message: "User Is Now Suspend",
            data,
          });
          return;
        }
        case AccountStatus.REJECTED: {
          const data = await processChangeUserAccountStatus({
            identityDocument,
            accountStatus,
            userId,
          });
          res.status(200).json({
            status: "success",
            message: "User Is Now Rejected",
            data,
          });
          return;
        }
      }
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default ProfileControllers;
