import { NextFunction, Request, Response } from "express";
import UserServices from "./user.services";
import logger from "../../configs/logger.configs";
import { IFindStaffRequestQuery, IUser } from "./user.interfaces";
import cookieOption from "../../utils/cookie.utils";
import mongoose, { Types } from "mongoose";
import { documentPerPage } from "../../const";
import { processOTP } from "./user.otpSender";

const {
  processSignup,
  processVerify,
  processLogin,
  processTokens,
  processLogout,
  processDeleteUser,
  processResend,
  processCreateStaff,
  processDeleteStaff,
  processFindAllStaff,
  processChangeStaffPassword,
  processChangeStaffRole,
  processChangeOwnPassword,
  processForgotPassword,
  processResetPassword,
  processResendForgotPasswordOtp
} = UserServices;

const UserControllers = {
  handleSignup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await processSignup(req.body);
      res
        .status(201)
        .json({ status: "success", message: "User Signup Successfully", data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleVerify: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const data = await processVerify(email, role);
      if (!data) {
        res.status(400).json({ status: "error", message: "Bad Request" });
        return;
      } else {
        const { accessToken, refreshToken } = data;
        res.clearCookie("refreshtoken");
        res.cookie("refreshtoken", refreshToken, cookieOption(null, 30));
        res.status(200).json({
          status: "success",
          message: "Account verification successful",
          accessToken,
        });
        return;
      }
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleLogin: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = processLogin(req.user as IUser);
      res.cookie("refreshtoken", refreshToken, cookieOption(null, 30));
      res.status(200).json({
        status: "success",
        message: "Login successful",
        accessToken,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleSendOTP: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      processOTP(email , role);
      res.status(200).json({
        status: "success",
        message: "OTP sent successfully",
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCheck: (req: Request, res: Response, next: NextFunction) => {
    try {
      const decoded = req.authenticateTokenDecoded;
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRefreshTokens: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = processTokens(
        req.authenticateTokenDecoded
      );
      res.clearCookie("refreshtoken");
      res.cookie("refreshtoken", refreshToken, cookieOption(null, 30));
      res.status(200).json({
        status: "success",
        message: "Token refreshed",
        accessToken,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleLogout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const accesstoken = authHeader?.split(" ")[1] as string;
      await processLogout(accesstoken);
      res.clearCookie("refreshtoken");
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid feature ID" });
        return;
      }
      const userId = new mongoose.Types.ObjectId(id);
      const isDeleted = await processDeleteUser({ id: userId });
      if (!isDeleted)
        res.status(404).json({ status: "error", message: "user not found" });
      res.status(200).json({ status: "success", message: "user deleted" });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleResend: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.user as IUser;
      await processResend({ email, name });
      res
        .status(200)
        .json({ status: "success", message: "Otp resend successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateStaff: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processCreateStaff(req.body);
      res
        .status(201)
        .json({ status: "success", message: "Staff Created", data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleChangeOwnPassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.authenticateTokenDecoded?.userId;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        res.status(400).json({
          status: "error",
          message: "Both oldPassword and newPassword are required",
        });
        return;
      }

      await processChangeOwnPassword({ userId: userId.toString(), oldPassword, newPassword });
      res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleForgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;

      if (!email || !role) {
        res.status(400).json({
          status: "error",
          message: "Email and role are required",
        });
        return;
      }

      const result = await processForgotPassword(email, role);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleResetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        res.status(400).json({
          status: "error",
          message: "Email, OTP, and newPassword are required",
        });
        return;
      }

      const result = await processResetPassword({ email, otp, newPassword });

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleResendForgotPasswordOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, role } = req.body as IUser;

      if (!email || !role) {
        res.status(400).json({
          status: "error",
          message: "Email and role are required",
        });
        return;
      }

      const result = await processResendForgotPasswordOtp( email, role );

      res.status(200).json({
        status: "success",
        message: result?.message,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },


  handleChangeStaffPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid feature ID" });
        return;
      }
      const userId = new mongoose.Types.ObjectId(id);
      await processChangeStaffPassword({ userId, password });
      res.status(200).json({
        status: "success",
        message: "Staff Password Change Successful",
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleChangeStaffRole: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid feature ID" });
        return;
      }
      const userId = new mongoose.Types.ObjectId(id);
      await processChangeStaffRole({ userId, role });
      res.status(200).json({
        status: "success",
        message: "Staff Role Change Successful",
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteStaff: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid feature ID" });
        return;
      }
      const userId = new mongoose.Types.ObjectId(id);
      const data = await processDeleteStaff({ id: userId });
      if (!data) {
        res.status(400).json({
          status: "success",
          message: "Staff Delete Successful",
          data,
        });
        return;
      }
      res
        .status(200)
        .json({ status: "success", message: "Staff Delete Successful", data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleFindAllStaff: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, role, search } = req.query as IFindStaffRequestQuery;
      const { data, total } = await processFindAllStaff({ page, role, search });
      const totalPages = Math.ceil(total / documentPerPage);
      const totalStaffs = total;
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path
        }`;

      const buildQuery = (pageNumber: number) => {
        const query = new URLSearchParams();
        if (search) query.set("search", search);
        if (pageNumber !== 1) query.set("page", String(pageNumber));
        if (role) query.set("role", String(role));
        const queryString = query.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
      };
      const currentPage = Number(page) || 1;
      const currentPageUrl = buildQuery(currentPage);
      const nextPageUrl =
        currentPage < totalPages ? buildQuery(currentPage + 1) : null;
      const previousPageUrl =
        currentPage > 1 ? buildQuery(currentPage - 1) : null;
      res.status(200).json({
        status: "success",
        message: `All Staff Retrieve successful`,
        totalStaffs,
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
};

export default UserControllers;
