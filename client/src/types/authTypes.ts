export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  accessToken: string;
}

export interface DecodedJwtPayload {
  email: string;
  isVerified: boolean;
  role: "host" | "guest" | string;
  userId: string;
  name: string;
  accountStatus: string;
  iat: number;
  exp: number;
}
export interface SignupResponse {
  status: string;
  message: string;
  data: SignupUserData;
}
export interface SignupFormValues {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "host" | "guest";
}

export interface SignupUserData {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  isStaff: boolean;
  isVerified: boolean;
  accountStatus: "active" | "inactive" | string;
  role: "guest" | "host" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface OtpResponse {
  status: string;
  message: string;
  accessToken: string;
}
export interface OtpPayload {
  email: string;
  otp: string;
  role: string;
}
export interface RefreshTokenResponse {
  status: string;
  message: string;
  accessToken: string;
}
export interface ChangedPassResponse {
  status: string;
  message: string;
}
