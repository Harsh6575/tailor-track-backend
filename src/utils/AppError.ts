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

  MethodNotAllowed: (msg = "Method not allowed", meta?: Record<string, unknown>) =>
    new AppError(msg, 405, meta, "METHOD_NOT_ALLOWED"),

  Conflict: (msg = "Conflict", meta?: Record<string, unknown>) =>
    new AppError(msg, 409, meta, "CONFLICT"),

  UnsupportedMediaType: (msg = "Unsupported media type", meta?: Record<string, unknown>) =>
    new AppError(msg, 415, meta, "UNSUPPORTED_MEDIA_TYPE"),

  Validation: (msg = "Validation failed", meta?: Record<string, unknown>) =>
    new AppError(msg, 422, meta, "VALIDATION_ERROR"),

  UnprocessableEntity: (msg = "Unprocessable entity", meta?: Record<string, unknown>) =>
    new AppError(msg, 422, meta, "UNPROCESSABLE_ENTITY"),

  TooManyRequests: (msg = "Too many requests", meta?: Record<string, unknown>) =>
    new AppError(msg, 429, meta, "TOO_MANY_REQUESTS"),

  Internal: (msg = "Internal server error", meta?: Record<string, unknown>) =>
    new AppError(msg, 500, meta, "INTERNAL_ERROR"),

  ServiceUnavailable: (msg = "Service temporarily unavailable", meta?: Record<string, unknown>) =>
    new AppError(msg, 503, meta, "SERVICE_UNAVAILABLE"),

  Timeout: (msg = "Request timed out", meta?: Record<string, unknown>) =>
    new AppError(msg, 504, meta, "TIMEOUT"),
};
