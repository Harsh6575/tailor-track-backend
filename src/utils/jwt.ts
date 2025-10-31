import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppError } from "./AppError.js";
import logger from "./logger.js";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// 15m access, 7d refresh — tweak as needed
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role?: string; // optional, useful later for admin roles
}

/**
 * Generate access and refresh tokens for a user
 */
export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    logger.error("❌ Access token verification failed", { error });
    throw new AppError("Invalid or expired access token", 401);
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    logger.error("❌ Refresh token verification failed", { error });
    throw new AppError("Invalid or expired refresh token", 401);
  }
};
