export const corsWhiteList = [
  "http://localhost:5173",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://localhost:4173",
  "https://property.okobiz.com",

  "https://property.okobiz.com",
  "https://propertyadmin.okobiz.com",
  "http://192.168.0.180:3000",
  "https://okobiz-property.vercel.app",
  "http://admin.okobizproperty.com",
  "http://okobizproperty.com",
  "*"
];
export const accessTokenExpiresIn = "24h";
export const refreshTokenExpiresIn = "30d";
export const saltRound = 10;
export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
export const baseUrl = {
  v1: "/api/v1",
};
export const documentPerPage = 9;
export const rejectionEmailSubject =
  "Identity Verification Failed – Action Needed";
export const approvedEmailSubject =
  "Success! Your Identity Has Been Verified on Okobiz-Property";
export const accountSuspendedEmailSubject =
  "Your Okobiz-Property Account Has Been Suspended Due to Policy Violation";
