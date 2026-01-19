export interface IVerificationEmailData {
  name: string;
  email: string;
  expirationTime: number;
  otp: string;
}

export interface IAccountVerificationParam {
  otp: string;
  email: string;
}
