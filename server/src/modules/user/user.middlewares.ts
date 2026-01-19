import { NextFunction, Request, Response } from "express";
import { signupInputValidationSchema } from "./user.validations";
import { processOTP } from "./user.otpSender"
// Extend Express Request interface to include 'role' and 'authenticateTokenDecoded'
declare global {
  namespace Express {
    interface Request {
      role?: string | null;
      user?: any;
    }
  }
}
import UserRepositories from "./user.repositories";
import redisClient from "../../configs/redis.configs";
import { verifyAccessToken, verifyRefreshToken } from "../../utils/jwt.utils";
import {
  AccountStatus,
  TokenPayload,
  UserRole,
} from "../../interfaces/jwtPayload.interfaces";
import { IUser } from "./user.interfaces";
import { comparePassword } from "../../utils/password.utils";
import User from "./user.model";

const { findUserByEmailOrPhone, findUserByEmail, findUserByEmailAndRole } = UserRepositories;

const UserMiddlewares = {
  signupInputValidation: (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const validationResult = signupInputValidationSchema.safeParse(payload);
    if (!validationResult?.success) {
      const formatErrors = validationResult?.error?.format();
      const errors = Object.entries(formatErrors)
        .filter(([key]) => key !== "_errors")
        .map(([field, value]) => {
          let message = "";
          if (Array.isArray(value)) {
            message = value[0];
          } else if (value?._errors) {
            message = value._errors[0];
          }

          return { field, message };
        });
      res
        .status(400)
        .json({ status: false, message: "Validation Error", error: errors });
      return;
    }
    next();
  },
  isSignupUserExist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, role } = req.body;
    const isUserExist = await findUserByEmailAndRole(email, role);
    if (isUserExist) {
      res.status(409).json({ status: "error", message: "User already exists" });
      return;
    }
    next();
  },
  isUserExistAndVerified: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, role } = req.body;
    console.log("req body == ", req.body);
    const isUserExist = await findUserByEmailAndRole(email, role);
    if (!isUserExist) {
      res.status(404).json({ status: "error", message: "User Not Found" });
      return;
    }
    if (!isUserExist.isVerified) {
      processOTP(email, role).catch((error) => {
        console.error("Error in resending OTP:", error);
      });
      res.status(422).json({ status: "error", message: "User Not Verified" });
      return;
    }
    req.user = isUserExist;
    next();
  },
  isUserExist: async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const isUserExist = await findUserByEmail(email);
    if (!isUserExist) {
      res.status(404).json({ status: "error", message: "User Not Found" });
      return;
    }
    req.user = isUserExist;
    next();
  },
  checkPassword: async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.user as IUser;
    if (!(await comparePassword(req?.body?.password, password))) {
      res.status(400).json({ status: "error", message: "Invalid Password" });
      return;
    }
    next();
  },
  // check role middleware for admin login usage.to check with login credential user is a admin or not
  checkRole: async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user as IUser;
    if (
      role === UserRole.Admin ||
      role === UserRole.AccountAdministrator ||
      role === UserRole.ContentManager ||
      role === UserRole.FinanceManager ||
      UserRole.ListingVerificationManager
    ) {
      next();
    } else {
      res.status(400).json({
        status: "error",
        message: "Invalid credentials or insufficient permissions",
      });
      return;
    }
  },
  allowRole: (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const role = req?.authenticateTokenDecoded?.role;

      if (!role || !allowedRoles.includes(role)) {
        res.status(403).json({
          status: "error",
          message: "You do not have permission to access this resource",
        });
        return;
      }

      next();
    };
  },
  isAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const role = req?.authenticateTokenDecoded?.role;
    if (role !== UserRole.Admin) {
      res.status(401).json({
        status: "error",
        message: "You do not have permission to access this resource",
      });
      return;
    }
    next();
  },
  isHost: async (req: Request, res: Response, next: NextFunction) => {
    const { role, accountStatus, email } = req?.authenticateTokenDecoded;
    const foundedUser = await User.findOne({ email });
    if (role !== UserRole.Host) {
      res.status(403).json({
        status: "error",
        message: "You do not have permission to access this resource",
      });
      return;
    }
    if (!foundedUser) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }
    switch (foundedUser.accountStatus) {
      case AccountStatus.INACTIVE:
        res.status(403).json({
          status: "error",
          message: "Identity verification is required to use this feature.",
        });
        return;
      case AccountStatus.PENDING:
        res.status(403).json({
          status: "error",
          message:
            "Your identity verification is pending. Please wait for admin approval.",
        });
        return;
      case AccountStatus.SUSPENDED:
        res.status(403).json({
          status: "error",
          message:
            "Your account is suspended. Please contact support for assistance.",
        });
        return;
    }
    next();
  },
  checkVerificationOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { otp, email, role } = req.body;
    const savedOtp = await redisClient.get(`user:otp:${email}:${role}`);
    if (!savedOtp) {
      res.status(400).json({ status: "error", message: "OTP has expired" });
      return;
    }
    if (savedOtp !== otp) {
      res
        .status(400)
        .json({ status: "error", message: "Provided OTP is incorrect" });
      return;
    }
    next();
  },
  checkAccessToken: async (req: Request, res: Response, next: NextFunction) => {


    const authHeader = req.headers.authorization;


    try {
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized Request",
          error: "Access token is missing",
        });
        return
      }

      const token = authHeader.split(" ")[1];

      const isBlacklisted = await redisClient.get(`blacklist:${token}`);


      if (isBlacklisted) {
        res.status(403).json({
          status: "error",
          message: "Permission Denied",
          error: "Access token has been revoked",
        });
        return
      }

      const decoded = verifyAccessToken(token);
      if (!decoded) {
        res.status(403).json({
          status: "error",
          message: "Permission Denied",
          error: "Access token expired or invalid",
        });
        return;
      }
      req.authenticateTokenDecoded = decoded as TokenPayload;


      next();
    } catch (error) {
      console.error("Middleware error ===", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error in auth middleware",
        error: (error as Error).message,
      });
      return;
    }
  },

  // checkAccessToken: async (req: Request, res: Response, next: NextFunction) => {
  //   req.authenticateTokenDecoded = decoded as TokenPayload;
  //   const authHeader = req.headers.authorization;
  //   console.log("authheader ===", authHeader)
  //   try {
  //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //       res.status(401).json({
  //         status: "error",
  //         message: "Unauthorize Request",
  //         error: "Accesstoken is missing",
  //       });
  //       return;
  //     }
  //     const token = authHeader?.split(" ")[1];
  //     console.log("token ===", token)
  //     const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  //     console.log("isBlacklisted ===", isBlacklisted)
  //     if (isBlacklisted) {
  //       res.status(403).json({
  //         status: "error",
  //         message: "Permission Denied",
  //         error: "Accesstoken has been revoked",
  //       });
  //       return;
  //     }
  //     const decoded = verifyAccessToken(token);
  //     if (!decoded) {
  //       res.status(403).json({
  //         status: "error",
  //         message: "Permission Denied",
  //         error: "Accesstoken expired or invalid",
  //       });
  //       return;
  //     }
  //     req.authenticateTokenDecoded = decoded as TokenPayload;
  //     next();
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  checkRefreshToken: (req: Request, res: Response, next: NextFunction) => {
    const { refreshtoken } = req.cookies;
    if (refreshtoken) {
      const decoded = verifyRefreshToken(refreshtoken);
      if (!decoded) {
        res.status(403).json({
          status: "error",
          message: "Permission Denied",
          error: "Refresh token expired or invalid",
        });
        return;
      } else {
        req.authenticateTokenDecoded = decoded as TokenPayload;
        next();
      }
    } else {
      res.status(401).json({
        status: "error",
        message: "Unauthorize Request",
        error: "Refresh token is missing",
      });
      return;
    }
  },
  //send role to the controller as req.role
  assignRole: (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      let token: string | undefined;
      let decoded: TokenPayload | null = null;
      if (authHeader) {
        token = authHeader.split(" ")[1];
        const result = verifyAccessToken(token);
        if (result) {
          decoded = result as TokenPayload;
        }
      }
      if (decoded) {
        req.authenticateTokenDecoded = decoded;
      }
      if (req.authenticateTokenDecoded) {
        const { role } = req.authenticateTokenDecoded;

        req.role = role || null; // Assign role or null if undefined
      } else {
        req.role = null; // Default to null if no token is decoded
      }
      next();
    } catch (error) {
      console.error("Error in assignRole middleware:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error in role assignment",
        error: (error as Error).message,
      });
    }
  },

};





export default UserMiddlewares;
