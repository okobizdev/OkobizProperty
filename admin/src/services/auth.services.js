import AuthApis from "../apis/auth.apis";

const {
  loginApi,
  refreshTokenApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  resendForgotPasswordOtpApi,
  
} = AuthApis;

const AuthServices = {
  processLogin: async (payload) => {
  try {
    const response = await loginApi(payload);
    return response?.data;
  } catch (error) {
    // Axios errors have a response property
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Login failed";
      const err = new Error(message);
      err.status = status;
      throw err;
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred in processLogin");
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
        throw new Error("Unknown error occurred in processLogin");
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
  processForgotPassword: async (payload) => {
    try {
      const response = await forgotPasswordApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in forgotPasswordApi");
      }
    }
  },
  processResetPassword: async (payload) => {
    try {
      const response = await resetPasswordApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in resetPasswordApi");
      }
    }
  },

  processResendForgotOtp: async (payload) => {
    try {
      const response = await resendForgotPasswordOtpApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in resetPasswordApi");
      }
    }
  },
  processTwoFactorOtp: async (payload) => {
    try {
      const response = await AuthApis.twoFactorOtpApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in twoFactorOtpApi");
      }
    }
  }
};

export default AuthServices;
