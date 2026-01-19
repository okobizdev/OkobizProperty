import axiosClient from "../configs/axios.config";

const AuthApis = {
  loginApi: (payload) => {
    return axiosClient.post("/admin/login", payload);
  },
  logoutApi: () => {
    return axiosClient.post("/logout");
  },
  refreshTokenApi: () => {
    return axiosClient.post("/refresh");
  },
  forgotPasswordApi: (payload) => {
    return axiosClient.post("/forgot-password", payload);
  },
  resetPasswordApi: (payload) => {
    return axiosClient.post("/reset-password", payload);
  },
  resendForgotPasswordOtpApi: (payload) => {
    return axiosClient.post("/resend-forgot-password", payload);
  },
  twoFactorOtpApi: (payload) => {
    return axiosClient.post("/admin/two-factor-auth", payload);
  },
};

export default AuthApis;
