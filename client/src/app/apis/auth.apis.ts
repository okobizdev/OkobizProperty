import axiosClient from "@/lib/axios.config";

const AuthApis = {
  loginApi: (payload: { email: string; password: string }) => {
    return axiosClient.post("/login", payload);
  },
  changedPassApi: (payload: { oldPassword: string; newPassword: string }) => {
    return axiosClient.patch(`/user/change-password`, payload);
  },
  logoutApi: () => {
    return axiosClient.post("/logout");
  },

  refreshTokenApi: () => {
    return axiosClient.post("/refresh");
  },

  signupApi: (payload: {
    name: string;
    email: string;
    password: string;
    role: "guest" | "host";
  }) => {
    return axiosClient.post("/signup", payload);
  },
  verifyEmailOtpApi: (payload: { email: string; otp: string; role: string }) => {
    return axiosClient.post("/verify", payload);
  },
  otpResendApi: (payload: { email: string }) => {
    return axiosClient.post("/resend", payload);
  },
  forgotPasswordApi: (payload: { email: string }) => {
    return axiosClient.post("/forgot-password", payload);
  },
  resetPasswordApi: (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    return axiosClient.post("/reset-password", payload);
  },
  resendForgotPasswordOtpApi: (payload: { email: string, role: string }) => {
    return axiosClient.post("/resend-forgot-password", payload);
  },
};

export default AuthApis;
