import { z, ZodError } from "zod";
import { Request } from "express";
import { Errors } from "./AppError.js";

export function validateRequest<T extends z.ZodTypeAny>(schema: T, req: Request): z.infer<T> {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const zodError = result.error as ZodError;
    throw Errors.BadRequest("Validation failed", {
      errors: zodError.issues,
    });
  }

  return result.data;
}
