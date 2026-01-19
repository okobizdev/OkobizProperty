import bcrypt from 'bcrypt';
import { saltRound } from '../const';
import logger from '../configs/logger.configs';

export const hashPassword = async (
  passwordString: string
): Promise<string> => {
  try {
    return await bcrypt.hash(passwordString, saltRound);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Hashing failed: ${error.message}`);
      throw error;
    } else {
      logger.error("Unexpected error occurred during password hashing");
      throw new Error("Unexpected hashing error");
    }
  }
};


export const comparePassword = async (
  requestedPassword: string,
  hashPassword: string
): Promise<Boolean | null> => {
  try {
    return await bcrypt.compare(requestedPassword, hashPassword);
  } catch (error) {
    if (error instanceof Error) {
      logger.warn(`Error Occurred In Compare Password Utils: ${error.message}`);
      return null;
    } else {
      logger.warn('Unexpected Error Occurred In Compare Password Utils');
      return null;
    }
  }
};