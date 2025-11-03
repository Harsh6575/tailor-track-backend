import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) throw new AppError("Authorization token missing", 401);

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  req.user = { id: payload.userId, email: payload.email }; // extend Express.Request type if needed
  next();
};
