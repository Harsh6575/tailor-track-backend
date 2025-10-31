import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "Internal Server Error";
  let meta: Record<string, unknown> | undefined;
  let stack: string | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    meta = err.meta;
    stack = err.stack;
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  logger.error("💥 Error occurred", {
    statusCode,
    message,
    code,
    meta,
    stack,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === "development" && {
        stack,
        meta,
      }),
    },
  });
};
