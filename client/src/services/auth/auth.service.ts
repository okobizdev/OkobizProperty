import AuthApis from "@/app/apis/auth.apis";
import { LoginResponse, OtpResponse, SignupResponse } from "@/types/authTypes";

const {
  loginApi,
  refreshTokenApi,
  logoutApi,
  signupApi,
  verifyEmailOtpApi,
  otpResendApi,
  changedPassApi,
  forgotPasswordApi,
  resetPasswordApi,
  resendForgotPasswordOtpApi,
} = AuthApis;

export const AuthServices = {
  processSignup: async (payload: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: "guest" | "host";
  }): Promise<SignupResponse> => {
    try {
      const response = await signupApi(payload);
      return response?.data as SignupResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processSignup");
      }
    }
  },
  processChangePassword: async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await changedPassApi(payload);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processChangedPass");
      }
    }
  },
  processLogin: async (payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await loginApi(payload);
    return response.data as LoginResponse;
  } catch (error: any) {
    // If using Axios, error.response will be defined
    if (error.response) {
      // You can access status code and message here
      const status = error.response.status;
      const message = error.response.data?.message || "Login failed";
      // Throw an error with status and message
      const err = new Error(message) as Error & { status?: number };
      err.status = status;
      throw err;
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred in processLogin");
    }
  }
},
  processVerifyEmailOtp: async (payload: {
    email: string;
    otp: string;
    role: string;
  }): Promise<OtpResponse> => {
    try {
      const response = await verifyEmailOtpApi(payload);
      return response?.data as OtpResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processSignup");
      }
    }
  },
  processResendOtp: async (payload: {
    email: string;
  }): Promise<OtpResponse> => {
    try {
      const response = await otpResendApi(payload);
      return response.data as OtpResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processResendOtp");
      }
    }
  },

  processLogout: async () => {
    try {
      const response = await logoutApi();
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processLogout");
      }
    }
  },

  processRefreshToken: async () => {
    try {
      const response = await refreshTokenApi();
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processRefreshToken");
      }
    }
  },
  processForgotPassword: async (payload: { email: string }) => {
    const response = await forgotPasswordApi(payload);
    return response?.data;
  },

  processResetPassword: async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    const response = await resetPasswordApi(payload);
    return response?.data;
  },

  processResendForgotOtp: async (payload: { email: string, role: string }) => {
    const response = await resendForgotPasswordOtpApi(payload);
    return response?.data;
  },
};

export const getUser = async () => {
  const token = localStorage.getItem("accessToken");
  return token;
};
