import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message: string;
  let meta: Record<string, unknown> | undefined;
  let stack: string | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    meta = err.meta;
    stack = err.stack;
  } else if (err instanceof Error) {
    // Non-AppError but still a valid JS error
    message = err.message;
    stack = err.stack;
  } else {
    // Handle weird cases like throwing non-error values
    message = "Unknown error occurred";
  }

  // 🚨 Log full details (always)
  logger.error("💥 Error occurred", {
    code,
    message,
    statusCode,
    ...(meta && { meta }),
    ...(stack && { stack }),
  });

  // 🧊 Send response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV !== "production" && {
        stack,
        meta,
      }),
    },
  });
};
