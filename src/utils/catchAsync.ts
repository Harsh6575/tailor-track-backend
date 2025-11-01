import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler and forwards errors to Express.
 *
 * Usage:
 * router.get("/", catchAsync(async (req, res) => { ... }));
 */

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
