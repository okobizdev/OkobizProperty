import dotenv from "dotenv";

dotenv.config();

const load = process.env;

export const getEnvVariable = (key: string): string => {
  const value = load[key];
  if (!value) {
    throw new Error(`Missing Environment Variable: ${key}`);
  }
  return value as string;
};
