import bcrypt from "bcryptjs";
import { AppError } from "./AppError.js";
import logger from "./logger.js";

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password.
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    logger.error("Error hashing password:", error);
    throw new AppError("Internal password validation error", 500);
  }
};

/**
 * Compare a plain-text password with its hash.
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    logger.error("Error comparing passwords:", error);
    throw new AppError("Internal password validation error", 500);
  }
};
