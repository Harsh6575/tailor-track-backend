export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  meta?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode = 500,
    meta?: Record<string, unknown>,
    code = "INTERNAL_ERROR"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.meta = meta;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Helper for common HTTP errors.
 */
export const Errors = {
  BadRequest: (msg = "Bad request", meta?: Record<string, unknown>) =>
    new AppError(msg, 400, meta, "BAD_REQUEST"),

  Unauthorized: (msg = "Unauthorized", meta?: Record<string, unknown>) =>
    new AppError(msg, 401, meta, "UNAUTHORIZED"),

  Forbidden: (msg = "Forbidden", meta?: Record<string, unknown>) =>
    new AppError(msg, 403, meta, "FORBIDDEN"),

  NotFound: (msg = "Not found", meta?: Record<string, unknown>) =>
    new AppError(msg, 404, meta, "NOT_FOUND"),

  Conflict: (msg = "Conflict", meta?: Record<string, unknown>) =>
    new AppError(msg, 409, meta, "CONFLICT"),

  Internal: (msg = "Internal server error", meta?: Record<string, unknown>) =>
    new AppError(msg, 500, meta, "INTERNAL_ERROR"),
};
