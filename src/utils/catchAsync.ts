import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler and forwards errors to Express.
 *
 * Usage:
 * router.get("/", catchAsync(async (req, res) => { ... }));
 */
export const catchAsync =
  <T extends Request = Request, U extends Response = Response>(
    fn: (req: T, res: U, next: NextFunction) => Promise<unknown>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as T, res as U, next)).catch(next);
  };
