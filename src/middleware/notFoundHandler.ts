import { Request, Response, NextFunction } from "express";
import { Errors } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const message = `Route ${req.method} ${req.originalUrl} not found`;

  // Log the warning with full context
  logger.warn("⚠️ Route not found", {
    method: req.method,
    url: req.originalUrl,
  });

  next(Errors.NotFound(message));
};
