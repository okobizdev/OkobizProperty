import redisClient from "../../configs/redis.configs";
import sendVerificationEmail from "../../utils/sendVerificationEmail.utils";
import { IUser } from "./user.interfaces";
import UserModel from "./user.model";
import otpGenerator from "otp-generator";

const processOTP = async (email: string, role: string): Promise<IUser> => {
  try {
    const isUserExist = await UserModel.findOne({ email, role });
    if (!isUserExist) {
        throw new Error("User does not exist");
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    await redisClient.set(
      `user:profile:${isUserExist._id}`,
      JSON.stringify(isUserExist),
      "EX",
      86400
    );
    await redisClient.set(`user:otp:${isUserExist.email}:${isUserExist.role}`, otp, "EX", 5 * 60);
    
    await sendVerificationEmail({
      email: isUserExist.email,
      expirationTime: 5,
      name: isUserExist.name,
      otp,
    });
    return isUserExist;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown Error Occurred In Signup Service");
    }
  }
};

export { processOTP };